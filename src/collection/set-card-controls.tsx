import { Edit3, Grid2X2, List } from "lucide-react";
import { m } from "#/paraglide/messages";

/** Controls collection editing, card layout, and grid density. */
export function SetCardControls({
	view,
	editMode,
	columns,
	onEditModeChange,
	onViewChange,
	onColumnsChange,
}: {
	view: "grid" | "list";
	editMode: boolean;
	columns: string;
	onEditModeChange: () => void;
	onViewChange: (view: "grid" | "list") => void;
	onColumnsChange: (columns: string) => void;
}) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
			<div className="flex items-center gap-2">
				<button
					aria-pressed={editMode}
					className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${editMode ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}
					onClick={onEditModeChange}
					type="button"
				>
					<Edit3 className="size-4" />
					<span>{editMode ? m.done_editing() : m.edit_collection()}</span>
				</button>
				<div
					aria-label={m.card_view()}
					className="flex rounded-md border bg-card p-1"
					role="toolbar"
				>
					<button
						aria-label={m.grid_view()}
						className={`rounded p-2 ${view === "grid" ? "bg-muted" : "text-muted-foreground"}`}
						onClick={() => onViewChange("grid")}
						type="button"
					>
						<Grid2X2 className="size-4" />
					</button>
					<button
						aria-label={m.list_view()}
						className={`rounded p-2 ${view === "list" ? "bg-muted" : "text-muted-foreground"}`}
						onClick={() => onViewChange("list")}
						type="button"
					>
						<List className="size-4" />
					</button>
				</div>
			</div>
			{view === "grid" && (
				<label className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>{m.cards_per_row()}</span>
					<select
						aria-label={m.cards_per_row()}
						className="h-9 rounded-md border bg-background px-2 text-foreground"
						onChange={(event) => onColumnsChange(event.target.value)}
						value={columns}
					>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5">5</option>
						<option value="6">6</option>
						<option value="7">7</option>
					</select>
				</label>
			)}
		</div>
	);
}
