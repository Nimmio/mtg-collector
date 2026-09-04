import { Check, Grid2X2, List, Plus } from "lucide-react";
import { useState } from "react";
import { addCollectionItemByScryfallId } from "./collection.api";
import type { SetSummary } from "./set-types";
import { formatReleaseDate } from "./set-utils";

type Card = Record<string, string | object | undefined>;
type CardResult = {
	total_cards: number;
	data: Card[];
	setInfo?: SetSummary;
	ownedScryfallIds?: string[];
};

export function SetCardView({
	set,
	result,
}: {
	set: string;
	result: CardResult;
}) {
	const [view, setView] = useState<"grid" | "list">("grid");
	const [columns, setColumns] = useState("5");
	const [addedCards, setAddedCards] = useState<Set<string>>(
		() => new Set(result.ownedScryfallIds ?? []),
	);
	const [addingCards, setAddingCards] = useState<Set<string>>(new Set());
	const [addError, setAddError] = useState<string | null>(null);
	const gridColumns = {
		"3": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3",
		"4": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
		"5": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
		"6": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
		"7": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-7",
	} as const;

	const addCard = async (cardId: string) => {
		setAddError(null);
		setAddingCards((current) => new Set(current).add(cardId));
		try {
			await addCollectionItemByScryfallId({ data: { scryfallId: cardId } });
			setAddedCards((current) => new Set(current).add(cardId));
		} catch (error) {
			setAddError(
				error instanceof Error
					? error.message
					: "Unable to add card to collection.",
			);
		} finally {
			setAddingCards((current) => {
				const next = new Set(current);
				next.delete(cardId);
				return next;
			});
		}
	};

	return (
		<div className="page-wrap space-y-6 py-2">
			<header className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 items-center gap-4">
						{result.setInfo?.iconUrl && (
							<img
								alt=""
								className="size-16 shrink-0 object-contain dark:invert"
								src={result.setInfo.iconUrl}
							/>
						)}
						<div className="min-w-0">
							<p className="island-kicker">Set cards</p>
							<h1 className="display-title mt-1 truncate text-3xl font-bold tracking-tight">
								{result.setInfo?.name ?? (set || "Cards")}
							</h1>
							<p className="mt-1 font-mono text-sm uppercase text-muted-foreground">
								{result.setInfo?.code ?? set}
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-right">
						<span className="text-muted-foreground">
							Cards{" "}
							<strong className="ml-1 text-foreground">
								{result.total_cards}
							</strong>
						</span>
						<span className="text-muted-foreground">
							Released{" "}
							<strong className="ml-1 text-foreground">
								{formatReleaseDate(result.setInfo?.releasedAt ?? null)}
							</strong>
						</span>
						<span className="text-muted-foreground">
							Type{" "}
							<strong className="ml-1 text-foreground">
								{result.setInfo?.setType ?? "Unknown"}
							</strong>
						</span>
					</div>
				</div>
			</header>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
				<div
					className="flex rounded-md border bg-card p-1"
					role="toolbar"
					aria-label="Card view"
				>
					<button
						aria-label="Grid view"
						className={`rounded p-2 ${view === "grid" ? "bg-muted" : "text-muted-foreground"}`}
						onClick={() => setView("grid")}
						type="button"
					>
						<Grid2X2 className="size-4" />
					</button>
					<button
						aria-label="List view"
						className={`rounded p-2 ${view === "list" ? "bg-muted" : "text-muted-foreground"}`}
						onClick={() => setView("list")}
						type="button"
					>
						<List className="size-4" />
					</button>
				</div>
				{view === "grid" && (
					<label className="flex items-center gap-2 text-sm text-muted-foreground">
						<span>Cards per row</span>
						<select
							aria-label="Cards per row"
							className="h-9 rounded-md border bg-background px-2 text-foreground"
							onChange={(event) => setColumns(event.target.value)}
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
			{addError && (
				<p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
					{addError}
				</p>
			)}
			<div
				className={
					view === "grid"
						? `grid gap-3 ${gridColumns[columns as keyof typeof gridColumns]}`
						: "grid gap-2"
				}
			>
				{result.data.map((card, index) => {
					const image =
						(card.image_uris as Record<string, string> | undefined)?.normal ??
						(
							card.card_faces as
								| Array<{ image_uris?: Record<string, string> }>
								| undefined
						)?.[0]?.image_uris?.normal;
					const cardId = String(card.id ?? index);
					const scryfallId = String(card.id ?? "");
					const added = addedCards.has(cardId);
					const adding = addingCards.has(cardId);
					return (
						<article
							key={cardId}
							className={
								view === "grid"
									? "relative overflow-hidden rounded-xl border bg-card"
									: "relative flex items-center gap-3 rounded-lg border bg-card p-3"
							}
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
							{!added && (
								<div
									aria-hidden="true"
									className="pointer-events-none absolute inset-0 bg-muted/55 grayscale"
								/>
							)}
							<button
								aria-label={added ? "In collection" : "Add to collection"}
								className="absolute right-2 top-2 rounded-full border bg-background/90 p-1.5 shadow-sm"
								disabled={added || adding}
								onClick={(event) => {
									event.preventDefault();
									event.stopPropagation();
									if (scryfallId) void addCard(scryfallId);
								}}
								type="button"
							>
								{added ? (
									<Check className="size-4 text-green-600" />
								) : (
									<Plus className={`size-4 ${adding ? "animate-spin" : ""}`} />
								)}
							</button>
							{added && (
								<span className="absolute bottom-2 left-2 rounded bg-background/90 px-1.5 py-0.5 text-xs font-medium text-green-700">
									In collection
								</span>
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
				})}
			</div>
		</div>
	);
}
