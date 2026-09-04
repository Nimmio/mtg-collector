import { getRequest } from "@tanstack/react-start/server";
import { prisma } from "../db.js";
import { auth } from "../lib/auth.js";

export async function requireUserId() {
	const session = await auth.api.getSession({ headers: getRequest().headers });
	if (!session?.user.id) throw new Error("Authentication required");
	await prisma.user.upsert({
		where: { id: session.user.id },
		create: { id: session.user.id },
		update: {},
	});
	return session.user.id;
}
