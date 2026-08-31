import { createServerFn } from "@tanstack/react-start";

export const getStorageLocations = createServerFn({ method: "GET" }).handler(
	async () => {
		const { requireUserId } = await import("../server/auth.server.js");
		const { listLocations } = await import("./prisma/storage.prisma.js");
		return listLocations(await requireUserId());
	},
);
