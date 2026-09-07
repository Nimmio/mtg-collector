import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { AuthForm } from "#/features/auth/AuthForm";
import { useLogin } from "#/features/auth/useLogin";
import { authClient } from "#/lib/auth-client";
import { m } from "#/paraglide/messages";

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
			title={m.welcome_back()}
			description={m.sign_in_to_collection()}
			submitLabel={m.sign_in()}
			{...controller}
			onEmailChange={controller.setEmail}
			onPasswordChange={controller.setPassword}
			footer={
				<>
					<span>{m.new_here()}</span>{" "}
					<Link className="underline" to="/signup">
						{m.create_account()}
					</Link>
				</>
			}
		/>
	);
}
