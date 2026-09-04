import {
	createFileRoute,
	redirect,
} from "@tanstack/react-router";

import { authClient } from "#/lib/auth-client";
import { AuthenticatedLayout } from "#/layout/authenticated-layout";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) throw redirect({ to: "/login" });
	},
	component: AuthenticatedLayout,
});
