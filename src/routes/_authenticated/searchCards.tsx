import { createFileRoute } from "@tanstack/react-router";

import SearchCardView from "#/features/searchCardView";

export const Route = createFileRoute("/_authenticated/searchCards")({
	component: RouteComponent,
});

function RouteComponent() {
	return <SearchCardView />;
}
