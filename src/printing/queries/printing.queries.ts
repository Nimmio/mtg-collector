import { queryOptions } from "@tanstack/react-query";

import { getPrinting, getPrintingsForCard } from "../printing.api.js";

export const printingQueryKeys = {
	all: ["printings"] as const,
	detail: (id: string) => ["printings", id] as const,
	byCard: (cardId: string) => ["printings", "card", cardId] as const,
};

export const printingQueryOptions = (id: string) =>
	queryOptions({
		queryKey: printingQueryKeys.detail(id),
		queryFn: () => getPrinting({ data: { id } }),
	});

export const cardPrintingsQueryOptions = (cardId: string) =>
	queryOptions({
		queryKey: printingQueryKeys.byCard(cardId),
		queryFn: () => getPrintingsForCard({ data: { cardId } }),
	});
