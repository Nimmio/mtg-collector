export type Theme = "light" | "dark";

export type Currency = "USD" | "EUR" | "GBP" | "CAD" | "AUD";
export type Language = "en" | "de";

export interface Settings {
	theme: Theme;
	cardsPerRow: number;
	currency: Currency;
	language: Language;
}

export const defaultSettings: Settings = {
	theme: "light",
	cardsPerRow: 5,
	currency: "USD",
	language: "en",
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
			language?: Language;
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
			language: stored?.language === "de" ? "de" : defaultSettings.language,
		};
	} catch {
		return defaultSettings;
	}
}

export function saveSettings(settings: Settings) {
	getStorage()?.setItem(storageKey, JSON.stringify(settings));
	if (typeof document !== "undefined") {
		// Keep the locale strategy in sync with the application preference.
		// biome-ignore lint/suspicious/noDocumentCookie: Paraglide reads this locale cookie.
		document.cookie = `PARAGLIDE_LOCALE=${settings.language}; path=/`;
	}
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
