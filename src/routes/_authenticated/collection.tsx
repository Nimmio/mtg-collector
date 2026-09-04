import { createFileRoute } from "@tanstack/react-router";

import { getSetSummaries } from "#/collection/collection.api";
import { SetOverview } from "#/collection/set-overview";

export const Route = createFileRoute("/_authenticated/collection")({
	loader: async () => {
		return getSetSummaries();
	},
	component: CollectionPage,
});

function CollectionPage() {
	const sets = Route.useLoaderData();

	return (
		<div className="page-wrap space-y-8 py-2">
			<header>
				<p className="island-kicker">Your library</p>
				<h1 className="display-title mt-2 text-4xl font-bold tracking-tight">
					Sets
				</h1>
				<p className="mt-2 max-w-2xl text-muted-foreground">
					Browse every Magic set and see your collection progress at a glance.
				</p>
			</header>
			<SetOverview sets={sets} />
		</div>
	);
}
