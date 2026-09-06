type Card = Record<string, string | object | undefined>;

/** Renders one card in either the grid or compact list presentation. */
export function SetCardItem({
	card,
	view,
	editMode,
	added,
	hasFoil,
	addingNormal,
	addingFoil,
	onOpen,
	onAdd,
}: {
	card: Card;
	view: "grid" | "list";
	editMode: boolean;
	added: boolean;
	hasFoil: boolean;
	addingNormal: boolean;
	addingFoil: boolean;
	onOpen: () => void;
	onAdd: (finish: "nonfoil" | "foil") => void;
}) {
	const image =
		(card.image_uris as Record<string, string> | undefined)?.normal ??
		(
			card.card_faces as
				| Array<{ image_uris?: Record<string, string> }>
				| undefined
		)?.[0]?.image_uris?.normal;
	return (
		<article
			className={`block w-full text-left ${view === "grid" ? "relative overflow-hidden rounded-xl border bg-card" : "relative flex items-center gap-3 rounded-lg border bg-card p-3"}`}
		>
			<button
				aria-label={`View details for ${String(card.name ?? "card")}`}
				className="block w-full text-left"
				onClick={onOpen}
				type="button"
			>
				{image && (
					<img
						alt={String(card.name ?? "Card")}
						className={
							view === "grid"
								? "aspect-[488/680] w-full object-cover"
								: "size-16 rounded object-cover"
						}
						loading="lazy"
						src={image}
					/>
				)}
			</button>
			{!added && (
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-muted/55 grayscale"
				/>
			)}
			{hasFoil && (
				<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,0,128,0.48)_5%,rgba(255,128,0,0.4)_25%,rgba(255,245,0,0.42)_42%,rgba(0,255,128,0.42)_58%,rgba(0,180,255,0.48)_75%,rgba(150,0,255,0.45)_95%)] mix-blend-screen opacity-90" />
			)}
			{editMode && (
				<div className="absolute inset-x-2 bottom-2 flex gap-1">
					<button
						className="flex-1 rounded border bg-background/95 px-2 py-1.5 text-xs font-medium shadow-sm disabled:opacity-50"
						disabled={addingNormal}
						onClick={() => onAdd("nonfoil")}
						type="button"
					>
						{addingNormal ? "Adding..." : "Add normal"}
					</button>
					<button
						className="flex-1 rounded border bg-background/95 px-2 py-1.5 text-xs font-medium shadow-sm disabled:opacity-50"
						disabled={addingFoil}
						onClick={() => onAdd("foil")}
						type="button"
					>
						{addingFoil ? "Adding..." : "Add foil"}
					</button>
				</div>
			)}
			{view === "list" && (
				<div className="min-w-0">
					<p className="truncate font-semibold">
						{String(card.name ?? "Unknown card")}
					</p>
					<p className="text-sm text-muted-foreground">
						{String(card.mana_cost ?? "")}
					</p>
				</div>
			)}
		</article>
	);
}
