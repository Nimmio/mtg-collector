import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireUserId } from "../../server/auth.server.js";
import { serializePrisma } from "../../server/serialize.server.js";
import {
	createCollectionItem,
	deleteCollectionItem,
	getCollectionItem,
	listCollection,
	listSetSummaries,
	updateCollectionItem,
} from "../prisma/collection.prisma.js";

const condition = z.enum([
	"near_mint",
	"lightly_played",
	"moderately_played",
	"heavily_played",
	"damaged",
]);
const finish = z.enum(["nonfoil", "foil", "etched"]);

export const getCollection = createServerFn({ method: "GET" }).handler(
	async () => serializePrisma(await listCollection(await requireUserId())),
);
export const getSetSummaries = createServerFn({ method: "GET" }).handler(
	async () => serializePrisma(await listSetSummaries(await requireUserId())),
);
export const getCollectionItemById = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data }) =>
		serializePrisma(await getCollectionItem(await requireUserId(), data.id)),
	);
export const addCollectionItem = createServerFn({ method: "POST" })
	.validator(
		z.object({
			printingId: z.string(),
			quantity: z.number().int().positive().default(1),
			finish: finish.default("nonfoil"),
			condition: condition.default("near_mint"),
			locationId: z.string().optional(),
			notes: z.string().max(5000).optional(),
		}),
	)
	.handler(async ({ data }) =>
		serializePrisma(await createCollectionItem(await requireUserId(), data)),
	);
export const addCollectionItemByScryfallId = createServerFn({ method: "POST" })
	.validator(z.object({ scryfallId: z.string() }))
	.handler(async ({ data }) => {
		const { prisma } = await import("../../db.js");
		const printing = await prisma.printing.findUnique({ where: { scryfallId: data.scryfallId } });
		if (!printing) throw new Error("This card is not available in the local card database yet.");
		return serializePrisma(await createCollectionItem(await requireUserId(), {
			printingId: printing.id,
			quantity: 1,
			finish: "nonfoil",
			condition: "near_mint",
		}));
	});
export const editCollectionItem = createServerFn({ method: "POST" })
	.validator(
		z.object({
			id: z.string(),
			quantity: z.number().int().positive().optional(),
			locationId: z.string().nullable().optional(),
			notes: z.string().max(5000).optional(),
			isForTrade: z.boolean().optional(),
			isForSale: z.boolean().optional(),
		}),
	)
	.handler(async ({ data }) =>
		updateCollectionItem(await requireUserId(), data.id, data),
	);
export const removeCollectionItem = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data }) =>
		deleteCollectionItem(await requireUserId(), data.id),
	);
