import { useDeferredValue, useState } from "react";
import type { SetOverviewController } from "#/collection/SetOverview.types";
import type { SetSummary, SortMode } from "#/collection/set-types";
import { readSettings } from "#/settings/settings";

export function useSetOverview(sets: SetSummary[]): SetOverviewController {
	const [search, setSearch] = useState("");
	const [type, setType] = useState("all");
	const [sort, setSort] = useState<SortMode>("release");
	const [cardsPerRow] = useState(() => readSettings().cardsPerRow);
	const query = useDeferredValue(search).trim().toLowerCase();
	const filteredSets = sets
		.filter((set) => type === "all" || set.setType === type)
		.filter(
			(set) =>
				!query ||
				set.name.toLowerCase().includes(query) ||
				set.code.toLowerCase().includes(query) ||
				set.groupName?.toLowerCase().includes(query),
		);

	return {
		search,
		type,
		sort,
		cardsPerRow,
		filteredSets,
		onSearchChange: setSearch,
		onTypeChange: setType,
		onSortChange: setSort,
	};
}
