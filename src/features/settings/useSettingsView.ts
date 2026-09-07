import { useState } from "react";
import type { SettingsViewController } from "#/features/settings/SettingsView.types";
import {
	type Currency,
	type defaultSettings,
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
		onSubmit: (event) => {
			event.preventDefault();
			saveSettings(settings);
			setSaved(true);
		},
	};
}
