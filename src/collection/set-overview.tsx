import type { SetOverviewProps } from "./SetOverview.types";
import { SetControls } from "./set-controls";
import { SetTable } from "./set-table";
import { useSetOverview } from "./useSetOverview";

/** Provides filtering and sorting controls for the set collection. */
export function SetOverview({ sets }: SetOverviewProps) {
	const controller = useSetOverview(sets);
	const {
		search,
		type,
		sort,
		cardsPerRow,
		filteredSets,
		onSearchChange,
		onTypeChange,
		onSortChange,
	} = controller;

	return (
		<div className="space-y-5">
			<SetControls
				search={search}
				sets={sets}
				sort={sort}
				type={type}
				onSearchChange={onSearchChange}
				onSortChange={onSortChange}
				onTypeChange={onTypeChange}
			/>
			<p className="text-sm text-muted-foreground">
				{filteredSets.length} sets
			</p>
			<SetTable sets={filteredSets} sort={sort} cardsPerRow={cardsPerRow} />
		</div>
	);
}
