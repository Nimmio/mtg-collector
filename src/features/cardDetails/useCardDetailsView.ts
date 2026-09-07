import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";

import {
	cardPrintingsQueryOptions,
	cardQueryOptions,
} from "#/card/queries/card.queries";
import {
	addCollectionItemByScryfallId,
	editCollectionItem,
	getCollectionItemsForPrinting,
} from "#/collection/collection.api";
import { useNotification } from "#/components/notification";
import type {
	Card,
	CardDetailsViewProps,
	Finish,
	Printing,
} from "#/features/cardDetails/CardDetailsView.types";

export type CardDetailsViewController = {
	card: ReturnType<typeof useQuery<Card>>;
	printings: ReturnType<typeof useQuery<Printing[]>>;
	displayedCard: Card | undefined;
	printingOptions: Printing[];
	showVersions: boolean;
	counts: { nonfoil: number; foil: number };
	draftCounts: { nonfoil: string; foil: string };
	savingFinish: string | null;
	countError: string | null;
	onBack: () => void;
	onToggleVersions: () => void;
	onPrintingSelect: (printingId: string) => void;
	onDraftCountChange: (finish: Finish, value: string) => void;
};

export function useCardDetailsView({
	id,
	onSynchronize,
	onBack,
}: Pick<
	CardDetailsViewProps,
	"id" | "onSynchronize" | "onBack"
>): CardDetailsViewController {
	const navigate = useNavigate();
	const [selectedPrinting] = useState<Card | null>(null);
	const [showVersions, setShowVersions] = useState(false);
	const [counts, setCounts] = useState({ nonfoil: 0, foil: 0 });
	const [savingFinish, setSavingFinish] = useState<string | null>(null);
	const [countError, setCountError] = useState<string | null>(null);
	const [draftCounts, setDraftCounts] = useState({ nonfoil: "", foil: "" });
	const { showNotification } = useNotification();

	const card = useQuery({
		...cardQueryOptions(id),
		select: (result) => result as Card,
	});
	const printings = useQuery({
		...cardPrintingsQueryOptions(card.data?.oracle_id ?? ""),
		select: (result) => result.data as Printing[],
	});
	const displayedCard = selectedPrinting ?? card.data;
	const printingOptions =
		printings.data?.filter((printing) => printing.id !== card.data?.id) ?? [];

	const loadCollectionCounts = useCallback(async (printingId: string) => {
		const items = await getCollectionItemsForPrinting({ data: { printingId } });
		const nextCounts = {
			nonfoil: items
				.filter((item) => item.finish === "nonfoil")
				.reduce((sum, item) => sum + item.quantity, 0),
			foil: items
				.filter((item) => item.finish === "foil")
				.reduce((sum, item) => sum + item.quantity, 0),
		};
		setCounts(nextCounts);
		setDraftCounts({
			nonfoil: String(nextCounts.nonfoil),
			foil: String(nextCounts.foil),
		});
	}, []);

	useEffect(() => {
		if (displayedCard) void loadCollectionCounts(displayedCard.id);
	}, [displayedCard, loadCollectionCounts]);

	const saveCount = useCallback(
		async (finish: Finish, value: number) => {
			if (!displayedCard) return false;
			setSavingFinish(finish);
			setCountError(null);
			try {
				const items = await getCollectionItemsForPrinting({
					data: { printingId: displayedCard.id },
				});
				const item = items.find((candidate) => candidate.finish === finish);
				if (item) {
					await editCollectionItem({ data: { id: item.id, quantity: value } });
					showNotification(
						`${finish === "foil" ? "Foil" : "Normal"} card value updated.`,
					);
				} else if (value > 0) {
					await addCollectionItemByScryfallId({
						data: { scryfallId: displayedCard.id, finish },
					});
					if (value > 1) {
						const refreshed = await getCollectionItemsForPrinting({
							data: { printingId: displayedCard.id },
						});
						const created = refreshed.find(
							(candidate) => candidate.finish === finish,
						);
						if (created)
							await editCollectionItem({
								data: { id: created.id, quantity: value },
							});
					}
					showNotification(
						`${finish === "foil" ? "Foil" : "Normal"} card added.`,
					);
				}
				setCounts((current) => ({ ...current, [finish]: value }));
				return true;
			} catch (error) {
				setCountError(
					error instanceof Error
						? error.message
						: "Unable to save collection count.",
				);
				return false;
			} finally {
				setSavingFinish(null);
			}
		},
		[showNotification, displayedCard],
	);

	const synchronizeInputs = useCallback(async () => {
		let success = true;
		for (const finish of ["nonfoil", "foil"] as const) {
			const value = Math.max(0, Number(draftCounts[finish]) || 0);
			if (value !== counts[finish] && !(await saveCount(finish, value)))
				success = false;
		}
		return success;
	}, [counts, draftCounts, saveCount]);

	useEffect(() => {
		onSynchronize?.(synchronizeInputs);
	}, [onSynchronize, synchronizeInputs]);

	function handleBack() {
		void synchronizeInputs().then((success) => {
			if (!success) return;
			if (onBack) onBack();
			else window.history.back();
		});
	}

	return {
		card,
		printings,
		displayedCard,
		printingOptions,
		showVersions,
		counts,
		draftCounts,
		savingFinish,
		countError,
		onBack: handleBack,
		onToggleVersions: () => setShowVersions((visible) => !visible),
		onPrintingSelect: (printingId) => {
			void navigate({
				to: "/cardDetails/$cardId",
				params: { cardId: printingId },
			});
		},
		onDraftCountChange: (finish, value) =>
			setDraftCounts((current) => ({ ...current, [finish]: value })),
	};
}
