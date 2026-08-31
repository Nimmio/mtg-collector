import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireUserId } from "../../server/auth.server.js";
import {
	createLocation,
	deleteLocation,
	listLocations,
} from "../prisma/storage.prisma.js";

export const getStorageLocations = createServerFn({ method: "GET" }).handler(
	async () => listLocations(await requireUserId()),
);
export const addStorageLocation = createServerFn({ method: "POST" })
	.validator(
		z.object({
			name: z.string().trim().min(1).max(100),
			description: z.string().max(500).optional(),
		}),
	)
	.handler(async ({ data }) =>
		createLocation(await requireUserId(), data.name, data.description),
	);
export const removeStorageLocation = createServerFn({ method: "POST" })
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data }) => deleteLocation(await requireUserId(), data.id));
