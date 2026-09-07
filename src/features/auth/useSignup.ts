import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { authClient } from "#/lib/auth-client";

export function useSignup() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);
		setError("");
		const result = await authClient.signUp.email({ name, email, password });
		setLoading(false);
		if (result.error) {
			setError(result.error.message ?? "Unable to create account");
			return;
		}
		await navigate({ to: "/" });
	}

	return {
		name,
		email,
		password,
		error,
		loading,
		setName,
		setEmail,
		setPassword,
		onSubmit,
	};
}
