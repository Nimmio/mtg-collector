import type { Currency } from "#/settings/settings";

export type CardPrices = {
	usd?: string | null;
	usd_foil?: string | null;
	eur?: string | null;
	eur_foil?: string | null;
};

export function formatCardPrice(
	prices: CardPrices | undefined,
	currency: Currency,
	foil = false,
) {
	const value =
		currency === "EUR"
			? foil
				? prices?.eur_foil
				: prices?.eur
			: foil
				? prices?.usd_foil
				: prices?.usd;

	if (!value) return null;
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: currency === "EUR" ? "EUR" : currency,
	}).format(Number(value));
}

export function cardHasPrices(prices: CardPrices | undefined) {
	return Boolean(
		prices?.usd || prices?.usd_foil || prices?.eur || prices?.eur_foil,
	);
}

export function formatCardPrices(
	prices: CardPrices | undefined,
	currency: Currency,
) {
	const normal = formatCardPrice(prices, currency);
	const foil = formatCardPrice(prices, currency, true);
	if (!normal && !foil) return null;
	return `${normal ?? "-"} / ${foil ?? "-"}`;
}
