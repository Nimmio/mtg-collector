export type SetSummary = {
	code: string;
	name: string;
	releasedAt: string | null;
	totalCards: number;
	ownedCards: number;
	ownedCopies: number;
	iconUrl: string | null;
	setType: string | null;
	group: string | null;
	groupCode: string | null;
	parentSetCode: string | null;
	groupKey: string | null;
	groupName: string | null;
};

export type SortMode = "release" | "name" | "cards" | "completion";
