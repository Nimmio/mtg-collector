import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SettingsView } from "#/features/settings/SettingsView";
import { Sidebar } from "#/layout/sidebar";
import { setCurrentLocale } from "#/lib/locale";

vi.mock("@tanstack/react-router", async (importOriginal) => ({
	...(await importOriginal<typeof import("@tanstack/react-router")>()),
	Link: ({ children }: { children: React.ReactNode }) => (
		<a href="/">{children}</a>
	),
	useLocation: () => ({ pathname: "/", search: {} }),
}));

describe("Sidebar", () => {
	it("updates translated navigation from the settings language selector", async () => {
		Element.prototype.scrollIntoView = vi.fn();
		Element.prototype.hasPointerCapture = vi.fn();
		Element.prototype.releasePointerCapture = vi.fn();
		const user = userEvent.setup({ pointerEventsCheck: 0 });
		setCurrentLocale("en");
		render(
			<>
				<SettingsView />
				<Sidebar />
			</>,
		);

		expect(screen.getByText("Collection")).toBeInTheDocument();

		await user.click(screen.getByRole("combobox", { name: "Language" }));
		await user.click(await screen.findByRole("option", { name: "Deutsch" }));
		expect(screen.getByText("Collection")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Save settings" }));

		await waitFor(() => {
			expect(screen.getByText("Sammlung")).toBeInTheDocument();
		});
	});
});
