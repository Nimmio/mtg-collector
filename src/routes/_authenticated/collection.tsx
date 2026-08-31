import { createFileRoute } from "@tanstack/react-router";

import { getCollection } from "#/collection/collection.api";

export const Route = createFileRoute("/_authenticated/collection")({
	loader: async () => {
		const data = await getCollection();
		console.log("Collection:", data);
		return data;
	},
	component: () => <Page title="Collection" />,
});

function Page({ title }: { title: string }) {
	return <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>;
}
