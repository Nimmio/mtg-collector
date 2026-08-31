import { createServerFn } from "@tanstack/react-start";

export const getTransactions = createServerFn({ method: "GET" }).handler(
	async () => {
		const { requireUserId } = await import("../server/auth.server.js");
		const { serializePrisma } = await import("../server/serialize.server.js");
		const { listTransactions } = await import("./prisma/transaction.prisma.js");
		return serializePrisma(await listTransactions(await requireUserId()));
	},
);
