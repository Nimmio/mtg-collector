import { Grid2X2, List } from "lucide-react";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { searchCards } from "#/card/server/card.api";
import { getSetSummaries } from "#/collection/collection.api";
import { formatReleaseDate } from "#/collection/set-utils";


export const Route = createFileRoute("/_authenticated/cards")({
	validateSearch: (search: Record<string, unknown>) => ({
		set: typeof search.set === "string" ? search.set : "",
	}),
	loaderDeps: ({ search }) => ({ set: search.set }),
	loader: async ({ deps }) => {
		if (!deps.set) return null;
		const [sets] = await Promise.all([getSetSummaries()]);
		const setInfo = sets.find((item) => item.code === deps.set);
		const cards = [];
		let page = 1;
		let result;
		do {
			result = await searchCards({ data: { query: `set:${deps.set}`, unique: "cards", page } });
			cards.push(...result.data);
			page += 1;
		} while (result.has_more);
		return { ...result, data: cards, setInfo };
	},
	component: CardsPage,
});

function CardsPage() {
	const { set } = Route.useSearch();
	const result = Route.useLoaderData();
	const [view, setView] = useState<"grid" | "list">("grid");
	const [columns, setColumns] = useState("5");
	const gridColumns = {
		"3": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3",
		"4": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
		"5": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
		"6": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
		"7": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-7",
	} as const;

	return (
		<div className="page-wrap space-y-6 py-2">
			<header className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex min-w-0 items-center gap-4">
						{result?.setInfo?.iconUrl && <img alt="" className="size-16 shrink-0 object-contain dark:invert" src={result.setInfo.iconUrl} />}
						<div className="min-w-0">
							<p className="island-kicker">Set cards</p>
							<h1 className="display-title mt-1 truncate text-3xl font-bold tracking-tight">{result?.setInfo?.name ?? (set || "Cards")}</h1>
							<p className="mt-1 font-mono text-sm uppercase text-muted-foreground">{result?.setInfo?.code ?? set}</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-right">
						<span className="text-muted-foreground">Cards <strong className="ml-1 text-foreground">{result?.total_cards ?? 0}</strong></span>
						<span className="text-muted-foreground">Released <strong className="ml-1 text-foreground">{formatReleaseDate(result?.setInfo?.releasedAt ?? null)}</strong></span>
						<span className="text-muted-foreground">Type <strong className="ml-1 text-foreground">{result?.setInfo?.setType ?? "Unknown"}</strong></span>
					</div>
				</div>
			</header>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
				<div className="flex rounded-md border bg-card p-1" role="group" aria-label="Card view">
					<button aria-label="Grid view" className={`rounded p-2 ${view === "grid" ? "bg-muted" : "text-muted-foreground"}`} onClick={() => setView("grid")} type="button"><Grid2X2 className="size-4" /></button>
					<button aria-label="List view" className={`rounded p-2 ${view === "list" ? "bg-muted" : "text-muted-foreground"}`} onClick={() => setView("list")} type="button"><List className="size-4" /></button>
				</div>
				{view === "grid" && <label className="flex items-center gap-2 text-sm text-muted-foreground"><span>Cards per row</span><select aria-label="Cards per row" className="h-9 rounded-md border bg-background px-2 text-foreground" onChange={(event) => setColumns(event.target.value)} value={columns}><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option></select></label>}
			</div>
			{result && <div className={view === "grid" ? `grid gap-3 ${gridColumns[columns as keyof typeof gridColumns]}` : "grid gap-2"}>{result.data.map((card, index) => {
				const image = (card.image_uris as Record<string, string> | undefined)?.normal ?? ((card.card_faces as Array<{ image_uris?: Record<string, string> }> | undefined)?.[0]?.image_uris?.normal);
				return <article key={String(card.id ?? index)} className={view === "grid" ? "overflow-hidden rounded-xl border bg-card" : "flex items-center gap-3 rounded-lg border bg-card p-3"}>{image && <img alt={String(card.name ?? "Card")} className={view === "grid" ? "aspect-[488/680] w-full object-cover" : "size-16 rounded object-cover"} loading="lazy" src={image} />}{view === "list" && <div className="min-w-0"><p className="truncate font-semibold">{String(card.name ?? "Unknown card")}</p><p className="text-sm text-muted-foreground">{String(card.mana_cost ?? "")}</p></div>}</article>;
			})}</div>}
		</div>
	);
}
