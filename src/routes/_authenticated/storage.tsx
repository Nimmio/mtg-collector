import { createFileRoute } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";
import { getStorageLocations } from "#/storage/storage.api";

export const Route = createFileRoute("/_authenticated/storage")({
	loader: async () => {
		const data = await getStorageLocations();
		console.log("Storage locations:", data);
		return data;
	},
	component: () => <Page title={m.storage()} />,
});

function Page({ title }: { title: string }) {
	return <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>;
}
