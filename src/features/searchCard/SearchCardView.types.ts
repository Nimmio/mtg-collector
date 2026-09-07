import type { FormEvent } from "react";

export const sortOptions = [
	{ value: "name", label: "Name" },
	{ value: "released", label: "Release date" },
	{ value: "set", label: "Set" },
	{ value: "rarity", label: "Rarity" },
	{ value: "usd", label: "USD price" },
	{ value: "tix", label: "MTGO price" },
	{ value: "edhrec", label: "EDHREC rank" },
] as const;

export type SortOption = (typeof sortOptions)[number]["value"];
export type SortDirection = "auto" | "asc" | "desc";

export type SearchCard = {
	id?: string;
	name?: string;
	set_name?: string;
	collector_number?: string;
	rarity?: string;
	released_at?: string;
	image_uris?: Record<string, string>;
	card_faces?: Array<{ image_uris?: Record<string, string> }>;
};

export type SearchResult = {
	total_cards: number;
	has_more: boolean;
	data: SearchCard[];
};

export type SearchCardViewController = {
	query: string;
	page: number;
	input: string;
	sort: SortOption;
	direction: SortDirection;
	result: SearchResult | undefined;
	isFetching: boolean;
	isError: boolean;
	error: unknown;
	totalPages: number;
	onInputChange: (value: string) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	onSortChange: (value: string) => void;
	onDirectionChange: (value: string) => void;
	onPageChange: (page: number) => void;
};
