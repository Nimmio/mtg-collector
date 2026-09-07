import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
	addCollectionItemByScryfallId,
	getOwnedScryfallIds,
} from "#/collection/collection.api";
import type {
	CardResult,
	CardView,
	Finish,
	SetCardViewController,
} from "#/collection/SetCardView.types";
import { useNotification } from "#/components/notification";

export function useSetCardView(
	set: string,
	result: CardResult,
): SetCardViewController {
	const [view, setView] = useState<CardView>("grid");
	const [editMode, setEditMode] = useState(false);
	const [columns, setColumns] = useState("5");
	const [ownedCards, setOwnedCards] = useState(() => result.ownedCards ?? []);
	const [addingCards, setAddingCards] = useState<Set<string>>(new Set());
	const [addError, setAddError] = useState<string | null>(null);
	const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
	const navigate = useNavigate();
	const { showNotification } = useNotification();
	const ownedCount = new Set(ownedCards.map((item) => item.scryfallId)).size;
	const completion = result.total_cards
		? Math.round((ownedCount / result.total_cards) * 100)
		: 0;
	const gridColumns = {
		"3": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-3",
		"4": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
		"5": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
		"6": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
		"7": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-7",
	};

	async function onAddCard(cardId: string, finish: Finish) {
		setAddError(null);
		const actionKey = `${cardId}:${finish}`;
		setAddingCards((current) => new Set(current).add(actionKey));
		try {
			await addCollectionItemByScryfallId({
				data: { scryfallId: cardId, finish },
			});
			setOwnedCards((current) => [
				...current,
				{ scryfallId: cardId, finish, quantity: 1 },
			]);
			showNotification(
				`${finish === "foil" ? "Foil" : "Normal"} card added to your collection.`,
			);
		} catch (error) {
			setAddError(
				error instanceof Error
					? error.message
					: "Unable to add card to collection.",
			);
		} finally {
			setAddingCards((current) => {
				const next = new Set(current);
				next.delete(actionKey);
				return next;
			});
		}
	}

	function onOpenCard(cardId: string) {
		if (window.matchMedia("(max-width: 639px)").matches) {
			void navigate({ to: "/cardDetails/$cardId", params: { cardId } });
			return;
		}
		setSelectedCardId(cardId);
	}

	async function onCloseCardDetails() {
		setSelectedCardId(null);
		setOwnedCards(await getOwnedScryfallIds({ data: { setCode: set } }));
	}

	return {
		view,
		editMode,
		columns,
		ownedCards,
		addingCards,
		addError,
		selectedCardId,
		ownedCount,
		completion,
		gridColumns,
		onEditModeChange: () => setEditMode((current) => !current),
		onViewChange: setView,
		onColumnsChange: setColumns,
		onOpenCard,
		onAddCard: (cardId, finish) => void onAddCard(cardId, finish),
		onCloseCardDetails: () => void onCloseCardDetails(),
	};
}
