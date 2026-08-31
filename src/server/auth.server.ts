import { getRequest } from "@tanstack/react-start/server";

import { auth } from "../lib/auth.js";

export async function requireUserId() {
	const session = await auth.api.getSession({ headers: getRequest().headers });
	if (!session?.user.id) throw new Error("Authentication required");
	return session.user.id;
}
