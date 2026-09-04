import { Outlet } from "@tanstack/react-router";

import { Sidebar } from "./sidebar";

export function AuthenticatedLayout() {
	return (
		<div className="min-h-svh bg-muted/30 md:flex md:h-svh md:overflow-hidden">
			<Sidebar />
			<main className="flex-1 p-6 md:overflow-y-auto md:p-10">
				<Outlet />
			</main>
		</div>
	);
}
