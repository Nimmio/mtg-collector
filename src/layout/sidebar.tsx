import { Link, useLocation } from "@tanstack/react-router";
import { UserMenu } from "#/layout/user-menu";
import { useLocale } from "#/lib/locale";
import { m } from "#/paraglide/messages";

const links = [
	["/", "dashboard"],
	["/collection", "collection"],
] as const;

export function Sidebar() {
	const locale = useLocale();
	const location = useLocation();
	const viewingSetCards =
		location.pathname === "/cards" && Boolean(location.search.set);

	return (
		<aside className="flex flex-col border-b bg-background p-4 md:h-svh md:w-64 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
			<div className="mb-8 px-2 text-lg font-semibold">MTG Collector</div>
			<nav className="grid gap-1">
				{links.map(([to, label]) => (
					<Link
						key={to}
						to={to}
						activeOptions={label === "dashboard" ? { exact: true } : undefined}
						className={`rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground ${label === "collection" && viewingSetCards ? "bg-accent text-accent-foreground" : ""}`}
						activeProps={{ className: "bg-accent text-accent-foreground" }}
					>
						{label === "dashboard"
							? m.dashboard({}, { locale })
							: m.collection({}, { locale })}
					</Link>
				))}
			</nav>
			<UserMenu />
		</aside>
	);
}
