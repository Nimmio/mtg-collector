import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SettingsView } from "#/features/settings/SettingsView";

vi.mock("#/settings/settings", async (importOriginal) => {
	const actual = await importOriginal<typeof import("#/settings/settings")>();
	return {
		...actual,
		readSettings: () => actual.defaultSettings,
		saveSettings: vi.fn(),
	};
});

describe("SettingsView", () => {
	it("saves changed preferences", async () => {
		const user = userEvent.setup();
		render(<SettingsView />);

		await user.selectOptions(screen.getByLabelText("Cards per row"), "7");
		await user.click(screen.getByRole("button", { name: "Save settings" }));

		expect(screen.getByText("Settings saved.")).toBeInTheDocument();
	});
});
