import { useSyncExternalStore } from "react";
import { getLocale } from "#/paraglide/runtime";

type Locale = "en" | "de";

const listeners = new Set<() => void>();
let currentLocale: Locale = getLocale();

export function setCurrentLocale(locale: Locale) {
	if (currentLocale === locale) return;
	currentLocale = locale;
	for (const listener of listeners) listener();
}

export function useLocale() {
	return useSyncExternalStore(
		(listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		() => currentLocale,
		() => currentLocale,
	);
}
