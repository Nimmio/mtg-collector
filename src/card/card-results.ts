type CardResult = { id?: string; oracle_id?: string };

export function uniqueCardResults<T extends CardResult>(cards: T[]) {
	const seen = new Set<string>();
	return cards.filter((card) => {
		const key = card.oracle_id ?? card.id;
		if (!key || seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
