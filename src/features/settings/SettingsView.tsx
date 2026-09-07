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
import { useLocale } from "#/lib/locale";
import { m } from "#/paraglide/messages";

export function SettingsView() {
	const locale = useLocale();
	const {
		settings,
		saved,
		onThemeChange,
		onCardsPerRowChange,
		onCurrencyChange,
		onLanguageChange,
		onSubmit,
	} = useSettingsView();

	return (
		<div className="page-wrap max-w-2xl space-y-8 py-2">
			<header>
				<p className="island-kicker">
					{m.application_preferences({}, { locale })}
				</p>
				<h1 className="display-title mt-2 text-4xl font-bold tracking-tight">
					{m.settings({}, { locale })}
				</h1>
				<p className="mt-2 text-muted-foreground">
					{m.choose_preferences({}, { locale })}
				</p>
			</header>
			<form
				onSubmit={onSubmit}
				className="island-shell space-y-8 rounded-2xl p-6"
			>
				<div className="space-y-2">
					<Label htmlFor="language">{m.language_label({}, { locale })}</Label>
					<Select
						value={settings.language}
						onValueChange={(value) => onLanguageChange(value)}
					>
						<SelectTrigger id="language" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="en">English</SelectItem>
							<SelectItem value="de">Deutsch</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="theme">{m.appearance({}, { locale })}</Label>
					<Select value={settings.theme} onValueChange={onThemeChange}>
						<SelectTrigger id="theme" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="light">
								{m.light_mode({}, { locale })}
							</SelectItem>
							<SelectItem value="dark">
								{m.dark_mode({}, { locale })}
							</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="cards-per-row">
						{m.cards_per_row({}, { locale })}
					</Label>
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
								{count} {m.cards({}, { locale }).toLocaleLowerCase()}
							</option>
						))}
					</select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="currency">{m.currency({}, { locale })}</Label>
					<Select value={settings.currency} onValueChange={onCurrencyChange}>
						<SelectTrigger id="currency" className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{[
								["USD", m.us_dollar({}, { locale })],
								["EUR", "Euro"],
								["GBP", m.british_pound({}, { locale })],
								["CAD", m.canadian_dollar({}, { locale })],
								["AUD", m.australian_dollar({}, { locale })],
							].map(([value, label]) => (
								<SelectItem key={value} value={value}>
									{value} - {label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-4">
					<Button type="submit">{m.save_settings({}, { locale })}</Button>
					{saved && (
						<span className="text-sm text-muted-foreground">
							{m.settings_saved({}, { locale })}
						</span>
					)}
				</div>
			</form>
		</div>
	);
}
