import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { useSettingsView } from "#/features/settings/useSettingsView";

export function SettingsView() {
	const {
		settings,
		saved,
		onThemeChange,
		onCardsPerRowChange,
		onCurrencyChange,
		onSubmit,
	} = useSettingsView();

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
				onSubmit={onSubmit}
				className="island-shell space-y-8 rounded-2xl p-6"
			>
				<div className="space-y-2">
					<Label htmlFor="theme">Appearance</Label>
					<Select value={settings.theme} onValueChange={onThemeChange}>
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
							onCardsPerRowChange(Number(event.target.value))
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
					<Select value={settings.currency} onValueChange={onCurrencyChange}>
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
