import type { SetSummary, SortMode } from "./set-types";

export function formatReleaseDate(value: string | null) {
	if (!value) return "Unknown";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "Unknown";
	return new Intl.DateTimeFormat(undefined, { month: "short", year: "numeric" }).format(date);
}

export function releaseTimestamp(value: string | null) {
	if (!value) return 0;
	const timestamp = new Date(value).getTime();
	return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function sortSets(a: SetSummary, b: SetSummary, sort: SortMode) {
	if (sort === "name") return a.name.localeCompare(b.name);
	if (sort === "cards") return b.totalCards - a.totalCards;
	if (sort === "completion") {
		const aCompletion = a.totalCards ? a.ownedCards / a.totalCards : 0;
		const bCompletion = b.totalCards ? b.ownedCards / b.totalCards : 0;
		return bCompletion - aCompletion;
	}
	return releaseTimestamp(b.releasedAt) - releaseTimestamp(a.releasedAt);
}
