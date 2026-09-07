import { uniqueCardResults } from "#/card/card-results";
import { CardDetailsModal } from "./card-details-modal";
import type { CardResult } from "./SetCardView.types";
import { SetCardControls } from "./set-card-controls";
import { SetCardHeader } from "./set-card-header";
import { SetCardItem } from "./set-card-item";
import { useSetCardView } from "./useSetCardView";

/** Displays cards in a set and coordinates collection updates and card details. */
export function SetCardView({
	set,
	result,
}: {
	set: string;
	result: CardResult;
}) {
	const controller = useSetCardView(set, result);
	const {
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
		onEditModeChange,
		onViewChange,
		onColumnsChange,
		onOpenCard,
		onAddCard,
		onCloseCardDetails,
	} = controller;

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
				onEditModeChange={onEditModeChange}
				onViewChange={onViewChange}
				onColumnsChange={onColumnsChange}
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
				{uniqueCardResults(result.data).map((card, index) => {
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
							onOpen={() => onOpenCard(scryfallId)}
							onAdd={(finish) => onAddCard(scryfallId, finish)}
						/>
					);
				})}
			</div>
			{selectedCardId && (
				<CardDetailsModal
					cardId={selectedCardId}
					onClose={onCloseCardDetails}
				/>
			)}
		</div>
	);
}
