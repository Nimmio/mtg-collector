import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import {
	defaultSettings,
	readSettings,
	saveSettings,
	type Currency,
	type Theme,
} from "#/settings/settings";

export const Route = createFileRoute("/_authenticated/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const [settings, setSettings] = useState(readSettings);
	const [saved, setSaved] = useState(false);

	function updateSettings<K extends keyof typeof defaultSettings>(
		key: K,
		value: (typeof defaultSettings)[K],
	) {
		setSaved(false);
		setSettings((current) => ({ ...current, [key]: value }));
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		saveSettings(settings);
		setSaved(true);
	}

	return (
		<div className="page-wrap max-w-2xl space-y-8 py-2">
			<header>
				<p className="island-kicker">Application preferences</p>
				<h1 className="display-title mt-2 text-4xl font-bold tracking-tight">
					Settings
				</h1>
				<p className="mt-2 text-muted-foreground">
					Choose how MTG Collector looks and how your card grids are arranged.
				</p>
			</header>

			<form
				onSubmit={handleSubmit}
				className="island-shell space-y-8 rounded-2xl p-6"
			>
				<div className="space-y-2">
					<Label htmlFor="theme">Appearance</Label>
					<Select
						value={settings.theme}
						onValueChange={(value) => updateSettings("theme", value as Theme)}
					>
						<SelectTrigger id="theme" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="light">Light mode</SelectItem>
							<SelectItem value="dark">Dark mode</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="cards-per-row">Cards per row</Label>
					<select
						id="cards-per-row"
						className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
						value={settings.cardsPerRow}
						onChange={(event) =>
							updateSettings("cardsPerRow", Number(event.target.value))
						}
					>
						{[3, 4, 5, 6, 7].map((count) => (
							<option key={count} value={count}>
								{count} cards
							</option>
						))}
					</select>
				</div>

				<div className="space-y-2">
					<Label htmlFor="currency">Currency</Label>
					<Select
						value={settings.currency}
						onValueChange={(value) =>
							updateSettings("currency", value as Currency)
						}
					>
						<SelectTrigger id="currency" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[
								["USD", "US Dollar"],
								["EUR", "Euro"],
								["GBP", "British Pound"],
								["CAD", "Canadian Dollar"],
								["AUD", "Australian Dollar"],
							].map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{value} - {label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-4">
					<Button type="submit">Save settings</Button>
					{saved && (
						<span className="text-sm text-muted-foreground">
							Settings saved.
						</span>
					)}
				</div>
			</form>
		</div>
	);
}
