import {
	createFileRoute,
	Link,
	redirect,
	useNavigate,
} from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { authClient } from "#/lib/auth-client";

export const Route = createFileRoute("/login")({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (session.data) throw redirect({ to: "/" });
	},
	component: LoginPage,
});

function LoginPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		setError("");
		const result = await authClient.signIn.email({ email, password });
		setLoading(false);
		if (result.error)
			return setError(result.error.message ?? "Unable to sign in");
		await navigate({ to: "/" });
	}

	return (
		<AuthForm
			title="Welcome back"
			description="Sign in to your collection"
			submitLabel="Sign in"
			email={email}
			password={password}
			error={error}
			loading={loading}
			onEmailChange={setEmail}
			onPasswordChange={setPassword}
			onSubmit={handleSubmit}
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

function AuthForm(props: {
	title: string;
	description: string;
	submitLabel: string;
	email: string;
	password: string;
	error: string;
	loading: boolean;
	onEmailChange: (value: string) => void;
	onPasswordChange: (value: string) => void;
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	footer: React.ReactNode;
}) {
	return (
		<main className="flex min-h-svh items-center justify-center px-6 py-12">
			<section className="w-full max-w-sm">
				<div className="mb-8 space-y-2">
					<p className="text-sm font-medium text-muted-foreground">
						MTG Collector
					</p>
					<h1 className="text-3xl font-semibold tracking-tight">
						{props.title}
					</h1>
					<p className="text-sm text-muted-foreground">{props.description}</p>
				</div>
				<form className="space-y-5" onSubmit={props.onSubmit}>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							required
							value={props.email}
							onChange={(event) => props.onEmailChange(event.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							minLength={8}
							required
							value={props.password}
							onChange={(event) => props.onPasswordChange(event.target.value)}
						/>
					</div>
					{props.error && (
						<p className="text-sm text-destructive">{props.error}</p>
					)}
					<Button className="w-full" type="submit" disabled={props.loading}>
						{props.loading ? "Please wait..." : props.submitLabel}
					</Button>
				</form>
				<p className="mt-6 text-center text-sm text-muted-foreground">
					{props.footer}
				</p>
			</section>
		</main>
	);
}
