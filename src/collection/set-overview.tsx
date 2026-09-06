import { useDeferredValue, useState } from "react";
import { SetControls } from "./set-controls";
import { SetTable } from "./set-table";
import type { SetSummary, SortMode } from "./set-types";
import { readSettings } from "#/settings/settings";

/** Provides filtering and sorting controls for the set collection. */
export function SetOverview({ sets }: { sets: SetSummary[] }) {
	const [search, setSearch] = useState("");
	const [type, setType] = useState("all");
	const [sort, setSort] = useState<SortMode>("release");
	const [cardsPerRow] = useState(() => readSettings().cardsPerRow);
	const deferredSearch = useDeferredValue(search);
	const query = deferredSearch.trim().toLowerCase();
	const filteredSets = sets
		.filter((set) => type === "all" || set.setType === type)
		.filter(
			(set) =>
				!query ||
				set.name.toLowerCase().includes(query) ||
				set.code.toLowerCase().includes(query) ||
				set.groupName?.toLowerCase().includes(query),
		);

	return (
		<div className="space-y-5">
			<SetControls
				search={search}
				sets={sets}
				sort={sort}
				type={type}
				onSearchChange={setSearch}
				onSortChange={setSort}
				onTypeChange={setType}
			/>
			<p className="text-sm text-muted-foreground">
				{filteredSets.length} sets
			</p>
			<SetTable sets={filteredSets} sort={sort} cardsPerRow={cardsPerRow} />
		</div>
	);
}
