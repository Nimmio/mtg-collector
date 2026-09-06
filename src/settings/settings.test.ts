import { describe, expect, it } from "vitest";
import {
	defaultSettings,
	readSettings,
	saveSettings,
} from "#/settings/settings";

describe("settings", () => {
	it("returns defaults when no preferences are saved", () => {
		expect(readSettings()).toEqual(defaultSettings);
	});

	it("persists and reads preferences", () => {
		const settings = {
			theme: "dark" as const,
			cardsPerRow: 6,
			currency: "EUR" as const,
		};
		Object.defineProperty(window, "localStorage", {
			configurable: true,
			value: {
				getItem: () => JSON.stringify(settings),
				setItem: () => undefined,
			},
		});

		saveSettings(settings);

		expect(readSettings()).toEqual(settings);
		expect(document.documentElement.classList.contains("dark")).toBe(true);
	});
});
