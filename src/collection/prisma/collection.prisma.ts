import { prisma } from "../../db.js";

const collectionInclude = {
	printing: { include: { card: true } },
	location: true,
} as const;

export function listCollection(userId: string) {
	return prisma.collectionItem.findMany({
		where: { userId },
		include: collectionInclude,
		orderBy: { updatedAt: "desc" },
	});
}

export function getCollectionItem(userId: string, id: string) {
	return prisma.collectionItem.findFirst({
		where: { id, userId },
		include: collectionInclude,
	});
}

export function createCollectionItem(
	userId: string,
	data: {
		printingId: string;
		quantity: number;
		finish: "nonfoil" | "foil" | "etched";
		condition:
			| "near_mint"
			| "lightly_played"
			| "moderately_played"
			| "heavily_played"
			| "damaged";
		locationId?: string;
		notes?: string;
	},
) {
	return prisma.collectionItem.create({
		data: { ...data, userId },
		include: collectionInclude,
	});
}

export function updateCollectionItem(
	userId: string,
	id: string,
	data: {
		quantity?: number;
		locationId?: string | null;
		notes?: string;
		isForTrade?: boolean;
		isForSale?: boolean;
	},
) {
	return prisma.collectionItem.updateMany({ where: { id, userId }, data });
}

export function deleteCollectionItem(userId: string, id: string) {
	return prisma.collectionItem.deleteMany({ where: { id, userId } });
}
