import { createServerFn } from "@tanstack/react-start";
import { cardSearchInput } from "../card.schema.js";

type SearchResponse = {
	object: "list";
	total_cards: number;
	has_more: boolean;
	data: Array<Record<string, string | object | undefined>>;
};

export const searchCards = createServerFn({ method: "GET" })
	.validator(cardSearchInput)
	.handler(async ({ data }) => {
		const { redisGet, redisSet } = await import("../../redis.js");
		const key = `scryfall:search:${data.unique}:${data.page}:${data.query.toLowerCase()}`;
		const cached = await redisGet<SearchResponse>(key);
		if (cached) return cached;

		const params = new URLSearchParams({
			q: data.query,
			unique: data.unique,
			page: String(data.page),
		});
		const response = await fetch(
			`https://api.scryfall.com/cards/search?${params}`,
			{
				headers: {
					Accept: "application/json",
					"User-Agent": "mtg-collector/1.0",
				},
			},
		);
		if (!response.ok)
			throw new Error(`Scryfall search failed (${response.status})`);

		const result = JSON.parse(
			JSON.stringify(await response.json()),
		) as SearchResponse;
		await redisSet(key, result, 60 * 60);
		return result;
	});

export const getCardByScryfallId = createServerFn({ method: "GET" })
	.validator(cardSearchInput.pick({ query: true }))
	.handler(async ({ data }) => {
		const { getScryfallCard } = await import("../../scryfall.js");
		const card = await getScryfallCard(data.query);
		return JSON.parse(JSON.stringify(card)) as Record<
			string,
			string | object | undefined
		>;
	});
