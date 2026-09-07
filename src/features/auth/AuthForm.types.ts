import type { FormEvent, ReactNode } from "react";

export type AuthFormProps = {
	name?: string;
	title: string;
	description: string;
	submitLabel: string;
	email: string;
	password: string;
	error: string;
	loading: boolean;
	onNameChange?: (value: string) => void;
	onEmailChange: (value: string) => void;
	onPasswordChange: (value: string) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	footer: ReactNode;
};
