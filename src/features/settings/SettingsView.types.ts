import type { FormEvent } from "react";
import type { Settings } from "#/settings/settings";

export type SettingsViewController = {
	settings: Settings;
	saved: boolean;
	onThemeChange: (value: string) => void;
	onCardsPerRowChange: (value: number) => void;
	onCurrencyChange: (value: string) => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};
