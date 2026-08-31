import {
	createFileRoute,
	Link,
	Outlet,
	redirect,
} from "@tanstack/react-router";

import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) throw redirect({ to: "/login" });
	},
	component: AuthenticatedLayout,
});

const links = [
	["/", "Dashboard"],
	["/cards", "Cards"],
	["/printings", "Printings"],
	["/collection", "Collection"],
	["/storage", "Storage"],
	["/transactions", "Transactions"],
] as const;

function AuthenticatedLayout() {
	return (
		<div className="min-h-svh bg-muted/30 md:flex">
			<aside className="border-b bg-background p-4 md:min-h-svh md:w-64 md:border-r md:border-b-0">
				<div className="mb-8 px-2 text-lg font-semibold">MTG Collector</div>
				<nav className="grid gap-1">
					{links.map(([to, label]) => (
						<Link
							key={to}
							to={to}
							activeProps={{ className: "bg-accent text-accent-foreground" }}
							className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
						>
							{label}
						</Link>
					))}
				</nav>
				<button
					type="button"
					className="mt-8 px-3 py-2 text-sm text-muted-foreground"
					onClick={() =>
						authClient.signOut({
							fetchOptions: {
								onSuccess: () => window.location.assign("/login"),
							},
						})
					}
				>
					Sign out
				</button>
			</aside>
			<main className="flex-1 p-6 md:p-10">
				<Outlet />
			</main>
		</div>
	);
}
