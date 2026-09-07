import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthForm } from "#/features/auth/AuthForm";

describe("AuthForm", () => {
	it("renders fields, errors, and submits user input", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn();

		render(
			<AuthForm
				name=""
				title="Create an account"
				description="Start tracking"
				submitLabel="Create account"
				email=""
				password=""
				error="Invalid details"
				loading={false}
				onNameChange={vi.fn()}
				onEmailChange={vi.fn()}
				onPasswordChange={vi.fn()}
				onSubmit={onSubmit}
				footer={<span>Sign in</span>}
			/>,
		);

		expect(screen.getByText("Invalid details")).toBeInTheDocument();
		await user.type(screen.getByLabelText("Email"), "user@example.com");
		await user.type(screen.getByLabelText("Password"), "password123");
		await user.type(screen.getByLabelText("Name"), "Alex");
		expect(
			screen.getByRole("button", { name: "Create account" }),
		).toBeEnabled();
	});

	it("shows the loading state", () => {
		render(
			<AuthForm
				title="Sign in"
				description="Welcome"
				submitLabel="Sign in"
				email=""
				password=""
				error=""
				loading
				onEmailChange={vi.fn()}
				onPasswordChange={vi.fn()}
				onSubmit={vi.fn()}
				footer={null}
			/>,
		);

		expect(
			screen.getByRole("button", { name: "Please wait..." }),
		).toBeDisabled();
	});
});
