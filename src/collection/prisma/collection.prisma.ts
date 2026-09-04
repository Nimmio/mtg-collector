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

export async function listSetSummaries(userId: string) {
	const [sets, owned] = await Promise.all([
		prisma.printing.groupBy({
			by: ["setCode", "setName"],
			_count: { _all: true },
			_min: { releasedAt: true },
			orderBy: { _min: { releasedAt: "desc" } },
		}),
		prisma.collectionItem.groupBy({
			by: ["printingId"],
			where: { userId },
			_sum: { quantity: true },
		}),
	]);

	const ownedByPrinting = new Map(
		owned.map((item) => [item.printingId, item._sum.quantity ?? 0]),
	);
	const printings = await prisma.printing.findMany({
		where: { id: { in: [...ownedByPrinting.keys()] } },
		select: { id: true, setCode: true },
	});
	const ownedBySet = new Map<string, { cards: number; copies: number }>();

	for (const printing of printings) {
		const current = ownedBySet.get(printing.setCode) ?? { cards: 0, copies: 0 };
		current.cards += 1;
		current.copies += ownedByPrinting.get(printing.id) ?? 0;
		ownedBySet.set(printing.setCode, current);
	}

	return sets.map((set) => ({
		code: set.setCode,
		name: set.setName,
		releasedAt: set._min.releasedAt,
		totalCards: set._count._all,
		ownedCards: ownedBySet.get(set.setCode)?.cards ?? 0,
		ownedCopies: ownedBySet.get(set.setCode)?.copies ?? 0,
	}));
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
