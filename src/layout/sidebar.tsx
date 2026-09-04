import { Link } from "@tanstack/react-router";

import { UserMenu } from "./user-menu";

const links = [
	["/", "Dashboard"],
	["/cards", "Cards"],
	["/printings", "Printings"],
	["/collection", "Collection"],
	["/storage", "Storage"],
	["/transactions", "Transactions"],
	["/searchCards", "SearchCard"],
] as const;

export function Sidebar() {
	return (
		<aside className="flex flex-col border-b bg-background p-4 md:h-svh md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
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
			<UserMenu />
		</aside>
	);
}
