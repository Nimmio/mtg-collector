import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { AuthForm } from "#/features/auth/AuthForm";
import { useSignup } from "#/features/auth/useSignup";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/signup")({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (session.data) throw redirect({ to: "/" });
	},
	component: SignupPage,
});

function SignupPage() {
	const controller = useSignup();
	return (
		<AuthForm
			title="Create an account"
			description="Start tracking your collection"
			submitLabel="Create account"
			{...controller}
			onNameChange={controller.setName}
			onEmailChange={controller.setEmail}
			onPasswordChange={controller.setPassword}
			footer={
				<>
					Already have an account?{" "}
					<Link className="underline" to="/login">
						Sign in
					</Link>
				</>
			}
		/>
	);
}
