import { createFileRoute } from "@tanstack/react-router";

import { getPrintingsForCard } from "#/printing/printing.api";

export const Route = createFileRoute("/_authenticated/printings")({
	loader: async () => {
		const data = await getPrintingsForCard({
			data: { cardId: "seed-card-id" },
		});
		console.log("Printings:", data);
		return data;
	},
	component: () => <Page title="Printings" />,
});

function Page({ title }: { title: string }) {
	return <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>;
}
