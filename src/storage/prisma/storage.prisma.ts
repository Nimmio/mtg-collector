import { prisma } from "../../db.js";

export function listLocations(userId: string) {
	return prisma.storageLocation.findMany({
		where: { userId },
		include: { _count: { select: { items: true } } },
		orderBy: { name: "asc" },
	});
}

export function createLocation(
	userId: string,
	name: string,
	description?: string,
) {
	return prisma.storageLocation.create({ data: { userId, name, description } });
}

export function deleteLocation(userId: string, id: string) {
	return prisma.storageLocation.deleteMany({ where: { userId, id } });
}
