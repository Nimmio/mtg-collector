import { type Job, Worker } from "bullmq";

import { prisma } from "../db.js";
import { env } from "../env.js";
import type { Prisma } from "../generated/prisma/client.js";
import { CARD_IMPORT_JOB, CARD_IMPORT_QUEUE } from "./card-import.queue.js";

const DEFAULT_CARDS_URL =
	"https://data.scryfall.io/default-cards/default-cards.json";

type ScryfallCard = {
	id: string;
	oracle_id?: string;
	name: string;
	printed_name?: string;
	mana_cost?: string;
	cmc?: number;
	type_line?: string;
	oracle_text?: string;
	printed_text?: string;
	color_identity?: string[];
	colors?: string[];
	keywords?: string[];
	power?: string;
	toughness?: string;
	loyalty?: string;
	defense?: string;
	layout: string;
	produced_mana?: string[];
	edhrec_rank?: number;
	penny_rank?: number;
	reserved?: boolean;
	game_changer?: boolean;
	scryfall_uri?: string;
	rulings_uri?: string;
	set: string;
	set_name: string;
	collector_number: string;
	lang: string;
	released_at?: string;
	rarity: string;
	artist?: string;
	flavor_text?: string;
	flavor_name?: string;
	watermark?: string;
	border_color?: string;
	frame?: string;
	frame_effects?: string[];
	security_stamp?: string;
	promo?: boolean;
	promo_types?: string[];
	variation?: boolean;
	digital?: boolean;
	full_art?: boolean;
	textless?: boolean;
	booster?: boolean;
	story_spotlight?: boolean;
	image_status?: string;
	image_uris?: Record<string, string>;
	prices?: Record<string, string | null>;
	card_faces?: Array<{
		name: string;
		mana_cost?: string;
		type_line?: string;
		oracle_text?: string;
		printed_name?: string;
		printed_text?: string;
		colors?: string[];
		color_indicator?: string[];
		power?: string;
		toughness?: string;
		loyalty?: string;
		defense?: string;
		image_uris?: Record<string, string>;
		illustration_id?: string;
	}>;
	[key: string]: unknown;
};

const decimal = (value: string | null | undefined) =>
	value && value !== "" ? value : undefined;

async function importCard(card: ScryfallCard) {
	const oracleId = card.oracle_id;
	if (!oracleId) return;
	await prisma.$transaction(async (transaction) => {
		const logicalCard = await transaction.card.upsert({
			where: { scryfallOracleId: oracleId },
			create: {
				scryfallOracleId: oracleId,
				name: card.name,
				printedName: card.printed_name,
				manaCost: card.mana_cost,
				cmc: card.cmc,
				typeLine: card.type_line,
				oracleText: card.oracle_text,
				printedText: card.printed_text,
				colorIdentity: card.color_identity ?? [],
				colors: card.colors ?? [],
				keywords: card.keywords ?? [],
				power: card.power,
				toughness: card.toughness,
				loyalty: card.loyalty,
				defense: card.defense,
				layout: card.layout as never,
				producedMana: card.produced_mana ?? [],
				edhrecRank: card.edhrec_rank,
				pennyRank: card.penny_rank,
				reserved: card.reserved ?? false,
				gameChanger: card.game_changer ?? false,
				scryfallUri: card.scryfall_uri,
				rulingsUri: card.rulings_uri,
				rawScryfallData: card as Prisma.InputJsonValue,
			},
			update: {
				name: card.name,
				printedName: card.printed_name,
				manaCost: card.mana_cost,
				typeLine: card.type_line,
				oracleText: card.oracle_text,
				rawScryfallData: card as Prisma.InputJsonValue,
			},
		});
		await transaction.printing.upsert({
			where: { scryfallId: card.id },
			create: printingData(logicalCard.id, card),
			update: printingData(logicalCard.id, card),
		});
		for (const [faceIndex, face] of (card.card_faces ?? []).entries()) {
			const images = face.image_uris ?? {};
			const data = {
				cardId: logicalCard.id,
				faceIndex,
				name: face.name,
				manaCost: face.mana_cost,
				typeLine: face.type_line,
				oracleText: face.oracle_text,
				printedName: face.printed_name,
				printedText: face.printed_text,
				colors: face.colors ?? [],
				colorIndicator: face.color_indicator ?? [],
				power: face.power,
				toughness: face.toughness,
				loyalty: face.loyalty,
				defense: face.defense,
				imageUri: images.normal ?? images.png ?? images.small,
				illustrationId: face.illustration_id,
			};
			await transaction.cardFace.upsert({
				where: { cardId_faceIndex: { cardId: logicalCard.id, faceIndex } },
				create: data,
				update: data,
			});
		}
	});
}

function printingData(cardId: string, card: ScryfallCard) {
	const images = card.image_uris ?? {};
	const prices = card.prices ?? {};
	return {
		cardId,
		scryfallId: card.id,
		setCode: card.set,
		setName: card.set_name,
		collectorNumber: card.collector_number,
		lang: card.lang,
		releasedAt: card.released_at ? new Date(card.released_at) : undefined,
		rarity: card.rarity as never,
		artist: card.artist,
		flavorText: card.flavor_text,
		flavorName: card.flavor_name,
		watermark: card.watermark,
		borderColor: card.border_color,
		frame: card.frame,
		frameEffects: card.frame_effects ?? [],
		securityStamp: card.security_stamp,
		promo: card.promo ?? false,
		promoTypes: card.promo_types ?? [],
		variation: card.variation ?? false,
		digital: card.digital ?? false,
		fullArt: card.full_art ?? false,
		textless: card.textless ?? false,
		booster: card.booster ?? false,
		storySpotlight: card.story_spotlight ?? false,
		imageStatus: card.image_status,
		imageSmall: images.small,
		imageNormal: images.normal,
		imageLarge: images.large,
		imagePng: images.png,
		imageArtCrop: images.art_crop,
		priceUsd: decimal(prices.usd),
		priceUsdFoil: decimal(prices.usd_foil),
		priceEur: decimal(prices.eur),
		priceEurFoil: decimal(prices.eur_foil),
		priceTix: decimal(prices.tix),
		pricesUpdatedAt: new Date(),
		rawScryfallData: card as Prisma.InputJsonValue,
	};
}

async function runBulkImport(job: Job) {
	console.info(`Starting card import: ${job.id}`);
	const response = await fetch(DEFAULT_CARDS_URL, {
		headers: {
			Accept: "application/json",
			"User-Agent": env.SCRYFALL_USER_AGENT,
		},
	});
	if (!response.ok)
		throw new Error(`Scryfall bulk download failed (${response.status})`);
	const cards = (await response.json()) as ScryfallCard[];
	console.info(`Downloaded ${cards.length} cards for import ${job.id}`);
	await job.updateProgress(0);

	for (const [index, card] of cards.entries()) {
		await importCard(card);
		const imported = index + 1;
		const progress = Math.round((imported / cards.length) * 100);
		await job.updateProgress(progress);
		if (imported % 500 === 0 || imported === cards.length)
			console.info(`Imported ${imported}/${cards.length} cards (${progress}%)`);
	}
}

const worker = new Worker(
	CARD_IMPORT_QUEUE,
	async (job) => {
		if (job.name === CARD_IMPORT_JOB) await runBulkImport(job);
	},
	{ connection: { url: env.REDIS_URL }, concurrency: 1 },
);

worker.on("completed", (job) =>
	console.info(`Card import completed: ${job.id}`),
);
worker.on("failed", (job, error) =>
	console.error(`Card import failed: ${job?.id}`, error),
);

for (const signal of ["SIGINT", "SIGTERM"] as const) {
	process.once(signal, async () => {
		await worker.close();
		await prisma.$disconnect();
	});
}
