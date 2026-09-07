import type { SetSummary } from "#/collection/set-types";

export type Card = Record<string, string | object | undefined>;

export type CardResult = {
	total_cards: number;
	data: Card[];
	setInfo?: SetSummary;
	ownedCards?: Array<{ scryfallId: string; finish: string; quantity: number }>;
};

export type CardView = "grid" | "list";
export type Finish = "nonfoil" | "foil";

export type SetCardViewController = {
	view: CardView;
	editMode: boolean;
	columns: string;
	ownedCards: NonNullable<CardResult["ownedCards"]>;
	addingCards: Set<string>;
	addError: string | null;
	selectedCardId: string | null;
	ownedCount: number;
	completion: number;
	gridColumns: Record<string, string>;
	onEditModeChange: () => void;
	onViewChange: (view: CardView) => void;
	onColumnsChange: (columns: string) => void;
	onOpenCard: (cardId: string) => void;
	onAddCard: (cardId: string, finish: Finish) => void;
	onCloseCardDetails: () => void;
};
