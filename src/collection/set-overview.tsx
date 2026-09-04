import { useDeferredValue, useState } from "react";
import { SetControls } from "./set-controls";
import { SetTable } from "./set-table";
import type { SetSummary, SortMode } from "./set-types";

export function SetOverview({ sets }: { sets: SetSummary[] }) {
	const [search, setSearch] = useState("");
	const [type, setType] = useState("all");
	const [sort, setSort] = useState<SortMode>("release");
	const deferredSearch = useDeferredValue(search);
	const query = deferredSearch.trim().toLowerCase();
	const visibleSets = sets
		.filter((set) => type === "all" || set.setType === type)
		.filter((set) => !query || set.name.toLowerCase().includes(query) || set.code.toLowerCase().includes(query) || set.groupName?.toLowerCase().includes(query));

	return (
		<div className="space-y-5">
			<SetControls search={search} sets={sets} sort={sort} type={type} onSearchChange={setSearch} onSortChange={setSort} onTypeChange={setType} />
			<p className="text-sm text-muted-foreground">{visibleSets.length} of {sets.length} sets</p>
			<SetTable sets={visibleSets} sort={sort} />
		</div>
	);
}
