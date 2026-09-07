import { createFileRoute, Link, redirect } from "@tanstack/react-router";

import { AuthForm } from "#/features/auth/AuthForm";
import { useSignup } from "#/features/auth/useSignup";
import { authClient } from "#/lib/auth-client";
import { m } from "#/paraglide/messages";

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
			title={m.create_account()}
			description={m.start_tracking_collection()}
			submitLabel={m.create_account()}
			{...controller}
			onNameChange={controller.setName}
			onEmailChange={controller.setEmail}
			onPasswordChange={controller.setPassword}
			footer={
				<>
					{m.already_have_account()}{" "}
					<Link className="underline" to="/login">
						{m.sign_in()}
					</Link>
				</>
			}
		/>
	);
}
