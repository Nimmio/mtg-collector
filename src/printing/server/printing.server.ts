import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { serializePrisma } from "../../server/serialize.server.js";
import {
	findPrintingById,
	listPrintingsForCard,
} from "../prisma/printing.prisma.js";

export const getPrinting = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.string().min(1) }))
	.handler(async ({ data }) =>
		serializePrisma(await findPrintingById(data.id)),
	);

export const getPrintingsForCard = createServerFn({ method: "GET" })
	.validator(z.object({ cardId: z.string().min(1) }))
	.handler(async ({ data }) =>
		serializePrisma(await listPrintingsForCard(data.cardId)),
	);
