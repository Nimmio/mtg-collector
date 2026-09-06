import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Prisma } from "../generated/prisma/client.js";

export const getCollection = createServerFn({ method: "GET" }).handler(
	async () => {
		const { requireUserId } = await import("../server/auth.server.js");
		const { serializePrisma } = await import("../server/serialize.server.js");
		const { listCollection } = await import("./prisma/collection.prisma.js");
		return serializePrisma(await listCollection(await requireUserId()));
	},
);

export const getCollectionItemById = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data }) => {
		const { requireUserId } = await import("../server/auth.server.js");
		const { serializePrisma } = await import("../server/serialize.server.js");
		const { getCollectionItem } = await import("./prisma/collection.prisma.js");
		return serializePrisma(
			await getCollectionItem(await requireUserId(), data.id),
		);
	});

export const getCollectionItemsForPrinting = createServerFn({ method: "GET" })
	.validator(z.object({ printingId: z.string() }))
	.handler(async ({ data }) => {
		const { requireUserId } = await import("../server/auth.server.js");
		const { prisma } = await import("../db.js");
		const userId = await requireUserId();
		const printing = await prisma.printing.findFirst({
			where: { id: data.printingId },
			select: { id: true, scryfallId: true },
		});
		return prisma.collectionItem.findMany({
			where: {
				userId,
				printing: printing
					? { OR: [{ id: printing.id }, { scryfallId: printing.scryfallId }] }
					: { scryfallId: data.printingId },
			},
			select: { id: true, finish: true, quantity: true },
		});
	});

export const editCollectionItem = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.string(),
			quantity: z.number().int().nonnegative().optional(),
			locationId: z.string().nullable().optional(),
			notes: z.string().max(5000).optional(),
			isForTrade: z.boolean().optional(),
			isForSale: z.boolean().optional(),
		}),
	)
	.handler(async ({ data }) => {
		const { requireUserId } = await import("../server/auth.server.js");
		const { deleteCollectionItem, updateCollectionItem } = await import(
			"./prisma/collection.prisma.js"
		);
		const userId = await requireUserId();
		return data.quantity === 0
			? deleteCollectionItem(userId, data.id)
			: updateCollectionItem(userId, data.id, data);
	});

export const getSetSummaries = createServerFn({ method: "GET" }).handler(
	async () => {
		const { requireUserId } = await import("../server/auth.server.js");
		const { listScryfallSets } = await import("../scryfall.js");
		const { listSetSummaries } = await import("./prisma/collection.prisma.js");
		const [sets, owned] = await Promise.all([
			listScryfallSets(),
			listSetSummaries(await requireUserId()),
		]);
		const ownedByCode = new Map(owned.map((set) => [set.code, set]));

		return sets.map((set) => ({
			code: set.code,
			name: set.name,
			releasedAt: set.released_at ?? null,
			totalCards: set.card_count,
			ownedCards: ownedByCode.get(set.code)?.ownedCards ?? 0,
			ownedCopies: ownedByCode.get(set.code)?.ownedCopies ?? 0,
			iconUrl: set.icon_svg_uri ?? null,
			setType: set.set_type ?? null,
			group: set.block ?? null,
			groupCode: set.block_code ?? null,
			parentSetCode: set.parent_set_code ?? null,
			groupKey:
				set.block_code ??
				(set.parent_set_code
					? (sets.find((parent) => parent.code === set.parent_set_code)
							?.block_code ?? set.parent_set_code)
					: null),
			groupName:
				set.block ??
				(set.parent_set_code
					? (sets.find((parent) => parent.code === set.parent_set_code)
							?.block ?? set.parent_set_code)
					: null),
		}));
	},
);

export const getOwnedScryfallIds = createServerFn({ method: "GET" })
	.validator(z.object({ setCode: z.string().optional() }))
	.handler(async ({ data }) => {
		const { requireUserId } = await import("../server/auth.server.js");
		const { prisma } = await import("../db.js");
		const items = await prisma.collectionItem.findMany({
			where: {
				userId: await requireUserId(),
				printing: data.setCode ? { setCode: data.setCode } : undefined,
			},
			select: {
				finish: true,
				quantity: true,
				printing: { select: { scryfallId: true } },
			},
		});
		return items.map((item) => ({
			scryfallId: item.printing.scryfallId,
			finish: item.finish,
			quantity: item.quantity,
		}));
	});

export const addCollectionItemByScryfallId = createServerFn({ method: "POST" })
	.validator(
		z.object({
			scryfallId: z.string(),
			finish: z.enum(["nonfoil", "foil"]).default("nonfoil"),
		}),
	)
	.handler(async ({ data }) => {
		const { requireUserId } = await import("../server/auth.server.js");
		const { serializePrisma } = await import("../server/serialize.server.js");
		const { prisma } = await import("../db.js");
		const { getScryfallCard } = await import("../scryfall.js");
		const { createCollectionItem } = await import(
			"./prisma/collection.prisma.js"
		);
		let printing = await prisma.printing.findUnique({
			where: { scryfallId: data.scryfallId },
		});
		if (!printing) {
			const card = await getScryfallCard(data.scryfallId);
			if (
				!card.oracle_id ||
				!card.set ||
				!card.set_name ||
				!card.collector_number ||
				!card.lang ||
				!card.layout ||
				!card.rarity
			) {
				throw new Error("Scryfall returned incomplete card data.");
			}
			const logicalCard = await prisma.card.upsert({
				where: { scryfallOracleId: card.oracle_id },
				create: {
					scryfallOracleId: card.oracle_id,
					name: card.name,
					layout: card.layout as never,
					colorIdentity: (card.color_identity as string[] | undefined) ?? [],
					colors: (card.colors as string[] | undefined) ?? [],
					keywords: (card.keywords as string[] | undefined) ?? [],
					producedMana: (card.produced_mana as string[] | undefined) ?? [],
					rawScryfallData: card as Prisma.InputJsonValue,
				},
				update: {
					name: card.name,
					rawScryfallData: card as Prisma.InputJsonValue,
				},
			});
			printing = await prisma.printing.create({
				data: {
					cardId: logicalCard.id,
					scryfallId: card.id,
					setCode: card.set as string,
					setName: card.set_name as string,
					collectorNumber: card.collector_number as string,
					lang: card.lang as string,
					releasedAt: card.released_at
						? new Date(card.released_at as string)
						: undefined,
					rarity: card.rarity as never,
					imageNormal: (card.image_uris as Record<string, string> | undefined)
						?.normal,
					rawScryfallData: card as Prisma.InputJsonValue,
				},
			});
		}
		return serializePrisma(
			await createCollectionItem(await requireUserId(), {
				printingId: printing.id,
				quantity: 1,
				finish: data.finish,
				condition: "near_mint",
			}),
		);
	});
