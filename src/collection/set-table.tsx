import { Fragment } from "react";
import { SetRow } from "./set-row";
import { sortSets } from "./set-utils";
import type { SetSummary, SortMode } from "./set-types";

export function SetTable({ sets, sort }: { sets: SetSummary[]; sort: SortMode }) {
	const visibleCodes = new Set(sets.map((set) => set.code));
	const childrenByParent = new Map<string, SetSummary[]>();
	for (const set of sets) {
		if (set.parentSetCode && visibleCodes.has(set.parentSetCode)) childrenByParent.set(set.parentSetCode, [...(childrenByParent.get(set.parentSetCode) ?? []), set]);
	}
	const roots = sets.filter((set) => !set.parentSetCode || !visibleCodes.has(set.parentSetCode));
	const renderSet = (set: SetSummary, depth = 0): React.ReactNode => {
		const children = [...(childrenByParent.get(set.code) ?? [])].sort((a, b) => sortSets(a, b, sort));
		return (
			<Fragment key={set.code}>
				<SetRow set={set} depth={depth} />
				{children.map((child) => renderSet(child, depth + 1))}
			</Fragment>
		);
	};

	return (
		<div className="overflow-hidden rounded-xl border bg-card">
			<div className="hidden grid-cols-[minmax(0,1fr)_8rem_8rem_12rem] gap-4 border-b bg-muted/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:grid"><span>Set</span><span>Cards</span><span>Released</span><span className="text-right">Collection</span></div>
			{roots.map((root) => renderSet(root))}
			{sets.length === 0 && <div className="p-10 text-center text-sm text-muted-foreground">No sets match your filters.</div>}
		</div>
	);
}
