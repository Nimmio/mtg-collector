import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useNotification } from "#/components/notification";
import { CardDetailsModal } from "./card-details-modal";
import {
	addCollectionItemByScryfallId,
	getOwnedScryfallIds,
} from "./collection.api";
import { SetCardControls } from "./set-card-controls";
import { SetCardHeader } from "./set-card-header";
import { SetCardItem } from "./set-card-item";
import type { SetSummary } from "./set-types";

type Card = Record<string, string | object | undefined>;
export type CardResult = {
	total_cards: number;
	data: Card[];
	setInfo?: SetSummary;
	ownedCards?: Array<{ scryfallId: string; finish: string; quantity: number }>;
};

/** Displays cards in a set and coordinates collection updates and card details. */
export function SetCardView({
	set,
	result,
}: {
	set: string;
	result: CardResult;
}) {
	const [view, setView] = useState<"grid" | "list">("grid");
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
	} as const;

	const addCard = async (cardId: string, finish: "nonfoil" | "foil") => {
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
	};

	const openCardDetails = (cardId: string) => {
		if (window.matchMedia("(max-width: 639px)").matches) {
			void navigate({ to: "/cardDetails/$cardId", params: { cardId } });
			return;
		}
		setSelectedCardId(cardId);
	};

	const closeCardDetails = async () => {
		setSelectedCardId(null);
		setOwnedCards(await getOwnedScryfallIds({ data: { setCode: set } }));
	};

	return (
		<div className="page-wrap space-y-6 py-2">
			<SetCardHeader
				set={set}
				result={result}
				ownedCount={ownedCount}
				completion={completion}
			/>
			<SetCardControls
				view={view}
				editMode={editMode}
				columns={columns}
				onEditModeChange={() => setEditMode((current) => !current)}
				onViewChange={setView}
				onColumnsChange={setColumns}
			/>
			{addError && (
				<p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
					{addError}
				</p>
			)}
			<div
				className={
					view === "grid"
						? `grid gap-3 ${gridColumns[columns as keyof typeof gridColumns]}`
						: "grid gap-2"
				}
			>
				{result.data.map((card, index) => {
					const cardId = String(card.id ?? index);
					const scryfallId = String(card.id ?? "");
					return (
						<SetCardItem
							key={cardId}
							card={card}
							view={view}
							editMode={editMode}
							added={ownedCards.some((item) => item.scryfallId === cardId)}
							hasFoil={ownedCards.some(
								(item) => item.scryfallId === cardId && item.finish === "foil",
							)}
							addingNormal={addingCards.has(`${cardId}:nonfoil`)}
							addingFoil={addingCards.has(`${cardId}:foil`)}
							onOpen={() => openCardDetails(scryfallId)}
							onAdd={(finish) => void addCard(scryfallId, finish)}
						/>
					);
				})}
			</div>
			{selectedCardId && (
				<CardDetailsModal
					cardId={selectedCardId}
					onClose={() => void closeCardDetails()}
				/>
			)}
		</div>
	);
}
