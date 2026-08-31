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

export const Route = createFileRoute("/signup")({
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (session.data) throw redirect({ to: "/" });
	},
	component: SignupPage,
});

function SignupPage() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		setError("");
		const result = await authClient.signUp.email({ name, email, password });
		setLoading(false);
		if (result.error)
			return setError(result.error.message ?? "Unable to create account");
		await navigate({ to: "/" });
	}

	return (
		<main className="flex min-h-svh items-center justify-center px-6 py-12">
			<section className="w-full max-w-sm">
				<div className="mb-8 space-y-2">
					<p className="text-sm font-medium text-muted-foreground">
						MTG Collector
					</p>
					<h1 className="text-3xl font-semibold tracking-tight">
						Create an account
					</h1>
					<p className="text-sm text-muted-foreground">
						Start tracking your collection
					</p>
				</div>
				<form className="space-y-5" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							id="name"
							required
							value={name}
							onChange={(event) => setName(event.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							required
							value={email}
							onChange={(event) => setEmail(event.target.value)}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							minLength={8}
							required
							value={password}
							onChange={(event) => setPassword(event.target.value)}
						/>
					</div>
					{error && <p className="text-sm text-destructive">{error}</p>}
					<Button className="w-full" type="submit" disabled={loading}>
						{loading ? "Please wait..." : "Create account"}
					</Button>
				</form>
				<p className="mt-6 text-center text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link className="underline" to="/login">
						Sign in
					</Link>
				</p>
			</section>
		</main>
	);
}
