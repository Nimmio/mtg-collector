import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
		const { getCollectionItem } = await import(
			"./prisma/collection.prisma.js"
		);
		return serializePrisma(await getCollectionItem(await requireUserId(), data.id));
	});

export const getSetSummaries = createServerFn({ method: "GET" }).handler(
	async () => {
		const { requireUserId } = await import("../server/auth.server.js");
		const { listScryfallSets } = await import("../scryfall.js");
		const { listSetSummaries } = await import(
			"./prisma/collection.prisma.js"
		);
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
					? sets.find((parent) => parent.code === set.parent_set_code)?.block_code ?? set.parent_set_code
					: null),
			groupName:
				set.block ??
				(set.parent_set_code
					? sets.find((parent) => parent.code === set.parent_set_code)?.block ?? set.parent_set_code
					: null),
		}));
	},
);
