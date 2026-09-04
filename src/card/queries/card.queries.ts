import { queryOptions } from "@tanstack/react-query";
import type { CardSearchInput } from "../card.schema.js";
import {
	getCardByScryfallId,
	getCardPrintings,
	searchCards,
} from "../server/card.api.js";

export const cardQueryKeys = {
	all: ["cards"] as const,
	detail: (query: string) => ["cards", "detail", query] as const,
	printings: (uri: string) => ["cards", "printings", uri] as const,
	search: (input: CardSearchInput) => ["cards", "search", input] as const,
};

export function cardQueryOptions(query: string) {
	return queryOptions({
		queryKey: cardQueryKeys.detail(query),
		queryFn: () => getCardByScryfallId({ data: { query } }),
		enabled: query.trim().length > 0,
		staleTime: 1000 * 60 * 60,
	});
}

export function cardPrintingsQueryOptions(uri: string) {
	return queryOptions({
		queryKey: cardQueryKeys.printings(uri),
		queryFn: () => getCardPrintings({ data: { query: uri } }),
		enabled: uri.length > 0,
		staleTime: 1000 * 60 * 60,
	});
}

export function cardSearchQueryOptions(input: CardSearchInput) {
	return queryOptions({
		queryKey: cardQueryKeys.search(input),
		queryFn: () => searchCards({ data: input }),
		enabled: input.query.trim().length > 0,
		staleTime: 1000 * 60 * 15,
	});
}
