import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getPrinting = createServerFn({ method: "GET" })
	.validator(z.object({ id: z.string().min(1) }))
	.handler(async ({ data }) => {
		const { serializePrisma } = await import("../server/serialize.server.js");
		const { findPrintingById } = await import("./prisma/printing.prisma.js");
		return serializePrisma(await findPrintingById(data.id));
	});

export const getPrintingsForCard = createServerFn({ method: "GET" })
	.validator(z.object({ cardId: z.string().min(1) }))
	.handler(async ({ data }) => {
		const { serializePrisma } = await import("../server/serialize.server.js");
		const { listPrintingsForCard } = await import(
			"./prisma/printing.prisma.js"
		);
		return serializePrisma(await listPrintingsForCard(data.cardId));
	});
