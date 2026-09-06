import { ChevronDown, Search } from "lucide-react";
import type { ReactNode } from "react";
import type { SetSummary, SortMode } from "./set-types";

type SetControlsProps = {
	sets: SetSummary[];
	search: string;
	type: string;
	sort: SortMode;
	onSearchChange: (value: string) => void;
	onTypeChange: (value: string) => void;
	onSortChange: (value: SortMode) => void;
};

/** Provides search, set-type, and sort controls for the set table. */
export function SetControls({
	sets,
	search,
	type,
	sort,
	onSearchChange,
	onTypeChange,
	onSortChange,
}: SetControlsProps) {
	const types = [
		...new Set(sets.map((set) => set.setType).filter(Boolean)),
	].sort();

	return (
		<div className="flex flex-col gap-3 rounded-xl border bg-card p-3 sm:flex-row sm:items-center">
			<label className="relative min-w-0 flex-1">
				<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
				<input
					aria-label="Find sets"
					className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
					onChange={(event) => onSearchChange(event.target.value)}
					placeholder="Find sets"
					value={search}
				/>
			</label>
			<Select label="Set type" onChange={onTypeChange} value={type}>
				<option value="all">All set types</option>
				{types.map((value) => (
					<option key={value} value={value ?? ""}>
						{value}
					</option>
				))}
			</Select>
			<Select
				label="Sort"
				onChange={(value) => onSortChange(value as SortMode)}
				value={sort}
			>
				<option value="release">Release date</option>
				<option value="name">Name</option>
				<option value="cards">Number of cards</option>
				<option value="completion">Collection progress</option>
			</Select>
		</div>
	);
}

function Select({
	children,
	label,
	onChange,
	value,
}: {
	children: ReactNode;
	label: string;
	onChange: (value: string) => void;
	value: string;
}) {
	return (
		<label className="relative shrink-0">
			<span className="sr-only">{label}</span>
			<select
				aria-label={label}
				className="h-10 w-full appearance-none rounded-md border bg-background py-2 pl-3 pr-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
				onChange={(event) => onChange(event.target.value)}
				value={value}
			>
				{children}
			</select>
			<ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
		</label>
	);
}
