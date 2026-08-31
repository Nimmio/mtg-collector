import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({ component: Home });

function Home() {
	return (
		<div>
			<h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
			<p className="mt-2 text-muted-foreground">Welcome to your collection.</p>
		</div>
	);
}
