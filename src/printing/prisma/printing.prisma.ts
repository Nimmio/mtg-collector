import { prisma } from "../../db.js";

export function findPrintingById(id: string) {
	return prisma.printing.findUnique({ where: { id }, include: { card: true } });
}

export function listPrintingsForCard(cardId: string) {
	return prisma.printing.findMany({
		where: { cardId },
		orderBy: { releasedAt: "desc" },
	});
}
