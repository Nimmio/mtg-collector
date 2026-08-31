import { createFileRoute } from "@tanstack/react-router";

import { getTransactions } from "#/transaction/transaction.api";

export const Route = createFileRoute("/_authenticated/transactions")({
	loader: async () => {
		const data = await getTransactions();
		console.log("Transactions:", data);
		return data;
	},
	component: () => <Page title="Transactions" />,
});

function Page({ title }: { title: string }) {
	return <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>;
}
