import { createFileRoute } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";

export const Route = createFileRoute("/_authenticated/")({ component: Home });

function Home() {
	return (
		<div>
			<h1 className="text-3xl font-semibold tracking-tight">{m.dashboard()}</h1>
			<p className="mt-2 text-muted-foreground">{m.dashboard_welcome()}</p>
		</div>
	);
}
