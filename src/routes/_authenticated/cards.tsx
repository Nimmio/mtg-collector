import { searchCards } from "#/card/server/card.api";
import { createFileRoute } from "@tanstack/react-router";


export const Route = createFileRoute("/_authenticated/cards")({
	loader: async () => {
		const data = await searchCards({
			data: { query: "lightning", unique: "cards", page: 1 },
		});
		console.log("Cards:", data);
		return data;
	},
	component: () => <Page title="Cards" />,
});

function Page({ title }: { title: string }) {
	return <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>;
}
