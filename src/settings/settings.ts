export type Theme = "light" | "dark";

export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD";

export interface Settings {
	theme: Theme;
	cardsPerRow: number;
	currency: Currency;
}

export const defaultSettings: Settings = {
	theme: "light",
	cardsPerRow: 5,
	currency: "USD",
};

const storageKey = "mtg-collector-settings";

function getStorage() {
	return typeof window === "undefined" ? null : window.localStorage;
}

export function readSettings(): Settings {
	if (typeof window === "undefined") return defaultSettings;
	const storage = getStorage();
	if (!storage) return defaultSettings;

	try {
		const stored = JSON.parse(storage.getItem(storageKey) ?? "null") as {
			theme?: Theme;
			cardsPerRow?: number;
			currency?: Currency;
		} | null;
		return {
			theme: stored?.theme === "dark" ? "dark" : defaultSettings.theme,
			cardsPerRow:
				stored?.cardsPerRow && stored.cardsPerRow > 0
					? stored.cardsPerRow
					: defaultSettings.cardsPerRow,
			currency:
				stored?.currency &&
				["USD", "EUR", "GBP", "CAD", "AUD"].includes(stored.currency)
					? stored.currency
					: defaultSettings.currency,
		};
	} catch {
		return defaultSettings;
	}
}

export function saveSettings(settings: Settings) {
	getStorage()?.setItem(storageKey, JSON.stringify(settings));
	if (typeof document !== "undefined")
		document.documentElement.classList.toggle(
			"dark",
			settings.theme === "dark",
		);
}

export function applyStoredTheme() {
	if (typeof document === "undefined") return;
	document.documentElement.classList.toggle(
		"dark",
		readSettings().theme === "dark",
	);
}
