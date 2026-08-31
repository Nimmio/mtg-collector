import { prisma } from "../../db.js";

export function listTransactions(userId: string) {
	return prisma.collectionTransaction.findMany({
		where: { userId },
		include: {
			collectionItem: { include: { printing: { include: { card: true } } } },
		},
		orderBy: { occurredAt: "desc" },
	});
}

export function createTransaction(
	userId: string,
	data: {
		collectionItemId: string;
		type:
			| "purchase"
			| "sale"
			| "trade_in"
			| "trade_out"
			| "gift_in"
			| "gift_out"
			| "found"
			| "lost"
			| "correction";
		quantity: number;
		unitPrice?: number;
		currency?: string;
		occurredAt?: Date;
		counterparty?: string;
		notes?: string;
	},
) {
	return prisma.collectionTransaction.create({ data: { ...data, userId } });
}
