import { createFileRoute } from "@tanstack/react-router";

import CardDetailsView from "#/features/cardDetails/cardDetailsView";

export const Route = createFileRoute("/_authenticated/cardDetails/$cardId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { cardId } = Route.useParams();
	return <CardDetailsView id={cardId} />;
}
