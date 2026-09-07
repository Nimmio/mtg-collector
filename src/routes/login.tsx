import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { AuthForm } from "#/features/auth/AuthForm";
import { useLogin } from "#/features/auth/useLogin";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/login")({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (session.data) throw redirect({ to: "/" });
	},
	component: LoginPage,
});

function LoginPage() {
	const controller = useLogin();
	return (
		<AuthForm
			title="Welcome back"
			description="Sign in to your collection"
			submitLabel="Sign in"
			{...controller}
			onEmailChange={controller.setEmail}
			onPasswordChange={controller.setPassword}
			footer={
				<>
					<span>New here?</span>{" "}
					<Link className="underline" to="/signup">
						Create an account
					</Link>
				</>
			}
		/>
	);
}
