import { prisma } from "../../db.js";

export async function findCardByScryfallId(scryfallId: string) {
	return prisma.printing.findUnique({
		where: { scryfallId },
		include: { card: true },
	});
}

export async function findCardsByName(name: string, take = 25) {
	return prisma.card.findMany({
		where: { name: { contains: name, mode: "insensitive" } },
		include: { printings: { take: 1, orderBy: { releasedAt: "desc" } } },
		orderBy: { name: "asc" },
		take,
	});
}
