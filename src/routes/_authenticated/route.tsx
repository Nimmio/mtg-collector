import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthenticatedLayout } from "#/layout/authenticated-layout";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) throw redirect({ to: "/login" });
	},
	component: AuthenticatedLayout,
});
