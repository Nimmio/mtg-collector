import { createFileRoute } from "@tanstack/react-router";
import { searchCards } from "#/card/server/card.api";
import {
	getOwnedScryfallIds,
	getSetSummaries,
} from "#/collection/collection.api";
import { SetCardView } from "#/collection/set-card-view";

export const Route = createFileRoute("/_authenticated/cards")({
	validateSearch: (search: Record<string, unknown>) => ({
		set: typeof search.set === "string" ? search.set : "",
	}),
	loaderDeps: ({ search }) => ({ set: search.set }),
	loader: async ({ deps }) => {
		if (!deps.set) return null;
		const [sets, ownedScryfallIds] = await Promise.all([
			getSetSummaries(),
			getOwnedScryfallIds(),
		]);
		const setInfo = sets.find((item) => item.code === deps.set);
		const cards = [];
		let page = 1;
		let result;
		do {
			result = await searchCards({
				data: { query: `set:${deps.set}`, unique: "cards", page },
			});
			cards.push(...result.data);
			page += 1;
		} while (result.has_more);
		return { ...result, data: cards, setInfo, ownedScryfallIds };
	},
	component: CardsPage,
});

function CardsPage() {
	const { set } = Route.useSearch();
	const result = Route.useLoaderData();
	return result ? (
		<SetCardView result={result} set={set} />
	) : (
		<div className="page-wrap py-2">
			<p className="text-muted-foreground">Select a set to view its cards.</p>
		</div>
	);
}
