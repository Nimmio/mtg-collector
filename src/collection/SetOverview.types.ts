import type { SetSummary, SortMode } from "#/collection/set-types";

export type SetOverviewProps = { sets: SetSummary[] };

export type SetOverviewController = {
	search: string;
	type: string;
	sort: SortMode;
	cardsPerRow: number;
	filteredSets: SetSummary[];
	onSearchChange: (value: string) => void;
	onTypeChange: (value: string) => void;
	onSortChange: (value: SortMode) => void;
};
