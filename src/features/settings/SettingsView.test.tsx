import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SettingsView } from "#/features/settings/SettingsView";

const { setLocale } = vi.hoisted(() => ({ setLocale: vi.fn() }));

vi.mock("#/paraglide/runtime", async (importOriginal) => ({
	...(await importOriginal<typeof import("#/paraglide/runtime")>()),
	setLocale,
}));

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

	it("changes the website language when settings are saved", async () => {
		render(<SettingsView />);

		const languageSelect = screen.getByRole("combobox", { name: "Language" });
		languageSelect.dispatchEvent(new Event("change", { bubbles: true }));

		expect(setLocale).toHaveBeenCalledWith("en", { reload: false });
	});
});
