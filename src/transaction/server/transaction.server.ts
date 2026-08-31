import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireUserId } from "../../server/auth.server.js";
import { serializePrisma } from "../../server/serialize.server.js";
import {
	createTransaction,
	listTransactions,
} from "../prisma/transaction.prisma.js";

const transactionType = z.enum([
	"purchase",
	"sale",
	"trade_in",
	"trade_out",
	"gift_in",
	"gift_out",
	"found",
	"lost",
	"correction",
]);

export const getTransactions = createServerFn({ method: "GET" }).handler(
	async () => serializePrisma(await listTransactions(await requireUserId())),
);
export const addTransaction = createServerFn({ method: "POST" })
	.validator(
		z.object({
			collectionItemId: z.string(),
			type: transactionType,
			quantity: z.number().int().positive(),
			unitPrice: z.number().nonnegative().optional(),
			currency: z.string().length(3).default("USD"),
			occurredAt: z.coerce.date().optional(),
			counterparty: z.string().max(200).optional(),
			notes: z.string().max(5000).optional(),
		}),
	)
	.handler(async ({ data }) =>
		serializePrisma(await createTransaction(await requireUserId(), data)),
	);
