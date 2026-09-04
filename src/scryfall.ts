import { env } from "./env.js";
import { redisGet, redisSet } from "./redis.js";

const SCRYFALL_API = "https://api.scryfall.com";
const CARD_TTL_SECONDS = 60 * 60 * 24 * 30;
const SET_TTL_SECONDS = 60 * 60 * 24 * 7;
const MIN_REQUEST_INTERVAL_MS = 100;

type ScryfallCard = {
	id: string;
	oracle_id?: string;
	name: string;
	[key: string]: unknown;
};

type ScryfallSet = {
	id: string;
	code: string;
	name: string;
	[key: string]: unknown;
};

export type ScryfallSetSummary = {
	code: string;
	name: string;
	released_at?: string;
	card_count: number;
	icon_svg_uri?: string;
	set_type?: string;
	block?: string;
	block_code?: string;
	parent_set_code?: string;
};

let lastRequestAt = 0;
let requestQueue = Promise.resolve();

async function waitForRateLimit() {
	const request = requestQueue.then(async () => {
		const delay = MIN_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt);
		if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
		lastRequestAt = Date.now();
	});

	requestQueue = request.catch(() => undefined);
	await request;
}

async function fetchScryfall<T>(path: string): Promise<T> {
	await waitForRateLimit();
	const response = await fetch(`${SCRYFALL_API}${path}`, {
		headers: {
			Accept: "application/json",
			"User-Agent": env.SCRYFALL_USER_AGENT,
		},
	});

	if (!response.ok) {
		throw new Error(`Scryfall request failed (${response.status}): ${path}`);
	}

	return (await response.json()) as T;
}

export async function getScryfallCard(idOrName: string) {
	const key = `scryfall:card:${idOrName.toLowerCase()}`;
	const cached = await redisGet<ScryfallCard>(key);
	if (cached) return cached;

	const path = idOrName.includes("-")
		? `/cards/${encodeURIComponent(idOrName)}`
		: `/cards/named?exact=${encodeURIComponent(idOrName)}`;
	const card = await fetchScryfall<ScryfallCard>(path);
	await redisSet(key, card, CARD_TTL_SECONDS);
	return card;
}

export async function getScryfallSet(code: string) {
	const key = `scryfall:set:${code.toLowerCase()}`;
	const cached = await redisGet<ScryfallSet>(key);
	if (cached) return cached;

	const set = await fetchScryfall<ScryfallSet>(
		`/sets/${encodeURIComponent(code)}`,
	);
	await redisSet(key, set, SET_TTL_SECONDS);
	return set;
}

export async function listScryfallSets() {
	const key = "scryfall:sets";
	const cached = await redisGet<{ data: ScryfallSetSummary[] }>(key);
	if (cached) return cached.data;

	const result = await fetchScryfall<{ data: ScryfallSetSummary[] }>("/sets");
	await redisSet(key, result, SET_TTL_SECONDS);
	return result.data;
}

export async function getScryfallPrintings(oracleId: string) {
	return fetchScryfall<{ data: ScryfallCard[] }>(
		`/cards/search?q=oracle_id%3A${encodeURIComponent(oracleId)}&unique=prints&order=released&dir=desc`,
	);
}
