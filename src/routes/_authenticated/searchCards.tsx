import { createFileRoute } from "@tanstack/react-router";

import SearchCardView from "#/features/searchCard/searchCardView";

export const Route = createFileRoute("/_authenticated/searchCards")({
	validateSearch: (search: Record<string, unknown>) => ({
		query: typeof search.query === "string" ? search.query : "",
		page: typeof search.page === "number" ? search.page : 1,
		sort: typeof search.sort === "string" ? search.sort : "name",
		direction: typeof search.direction === "string" ? search.direction : "auto",
	}),
	component: RouteComponent,
});

function RouteComponent() {
	return <SearchCardView />;
}
