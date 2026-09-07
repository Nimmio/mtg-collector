import { useState } from "react";
import type { SettingsViewController } from "#/features/settings/SettingsView.types";
import { setCurrentLocale } from "#/lib/locale";
import { setLocale } from "#/paraglide/runtime";
import {
	type Currency,
	type defaultSettings,
	type Language,
	readSettings,
	saveSettings,
	type Theme,
} from "#/settings/settings";

export function useSettingsView(): SettingsViewController {
	const [settings, setSettings] = useState(readSettings);
	const [saved, setSaved] = useState(false);

	function updateSettings<K extends keyof typeof defaultSettings>(
		key: K,
		value: (typeof defaultSettings)[K],
	) {
		setSaved(false);
		setSettings((current) => ({ ...current, [key]: value }));
	}

	return {
		settings,
		saved,
		onThemeChange: (value) => updateSettings("theme", value as Theme),
		onCardsPerRowChange: (value) => updateSettings("cardsPerRow", value),
		onCurrencyChange: (value) => updateSettings("currency", value as Currency),
		onLanguageChange: (value) => {
			const language = value as Language;
			updateSettings("language", language);
		},
		onSubmit: (event) => {
			event.preventDefault();
			saveSettings(settings);
			setLocale(settings.language, { reload: false });
			setCurrentLocale(settings.language);
			document.documentElement.lang = settings.language;
			setSaved(true);
		},
	};
}
