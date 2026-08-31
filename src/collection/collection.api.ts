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
