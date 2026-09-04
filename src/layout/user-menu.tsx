import { Link } from "@tanstack/react-router";

import { authClient } from "#/lib/auth-client";

export function UserMenu() {
	const session = authClient.useSession();
	const user = session.data?.user;
	const name = user?.name || user?.email || "User";

	return (
		<details className="group mt-auto border-t pt-4">
			<summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent">
				<span className="truncate font-medium">{name}</span>
				<span className="text-muted-foreground transition-transform group-open:rotate-180">⌄</span>
			</summary>
			<div className="mt-1 grid gap-1 rounded-md border bg-background p-1 shadow-sm">
				<Link
					to="/settings"
					className="rounded px-3 py-2 text-sm hover:bg-accent"
				>
					Settings
				</Link>
				<button
					type="button"
					className="rounded px-3 py-2 text-left text-sm text-destructive hover:bg-accent"
					onClick={() =>
						authClient.signOut({
							fetchOptions: {
								onSuccess: () => window.location.assign("/login"),
							},
						})
					}
				>
					Log out
				</button>
			</div>
		</details>
	);
}
