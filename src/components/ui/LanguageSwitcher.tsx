import { m } from "#/paraglide/messages";
import { getLocale, locales, setLocale } from "#/paraglide/runtime";

export function LanguageSwitcher() {
	const currentLocale = getLocale();

	return (
		<div className="flex items-center gap-2">
			<span className="sr-only">{m.language_label()}</span>
			{locales.map((locale) => (
				<button
					key={locale}
					type="button"
					className="rounded border px-2 py-1 text-xs font-medium uppercase hover:bg-accent"
					aria-pressed={locale === currentLocale}
					onClick={() => setLocale(locale)}
				>
					{locale}
				</button>
			))}
		</div>
	);
}
