import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "#/lib/auth-client";

export function useLogin() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		setError("");
		const result = await authClient.signIn.email({ email, password });
		setLoading(false);
		if (result.error) {
			setError(result.error.message ?? "Unable to sign in");
			return;
		}
		await navigate({ to: "/" });
	}

	return { email, password, error, loading, setEmail, setPassword, onSubmit };
}
