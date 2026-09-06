import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

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
import { Button } from "#/components/ui/button";

type CardDetailsViewProps = {
	id: string;
	onSynchronize?: (synchronize: () => Promise<boolean>) => void;
	onBack?: () => void;
	showNavigation?: boolean;
	showVersions?: boolean;
};

type Card = {
	id: string;
	name?: string;
	set_name?: string;
	set?: string;
	collector_number?: string;
	released_at?: string;
	rarity?: string;
	artist?: string;
	mana_cost?: string;
	type_line?: string;
	oracle_text?: string;
	power?: string;
	toughness?: string;
	image_uris?: Record<string, string>;
	prints_search_uri?: string;
	oracle_id?: string;
	card_faces?: Array<{
		name?: string;
		image_uris?: Record<string, string>;
		mana_cost?: string;
		type_line?: string;
		oracle_text?: string;
	}>;
};

type Printing = Card & { id: string };

function imageFor(card: Card, face?: NonNullable<Card["card_faces"]>[number]) {
	return (
		face?.image_uris?.large ??
		card.image_uris?.large ??
		face?.image_uris?.normal ??
		card.image_uris?.normal
	);
}

const CardDetailsView = ({
	id,
	onSynchronize,
	onBack,
	showNavigation = true,
	showVersions: showVersionsEnabled = true,
}: CardDetailsViewProps) => {
	const navigate = useNavigate();
	const [selectedPrinting] = useState<Card | null>(null);
	const [showVersions, setShowVersions] = useState(false);
	const [counts, setCounts] = useState({ nonfoil: 0, foil: 0 });
	const [countsLoadedFor, setCountsLoadedFor] = useState<string | null>(null);
	const [savingFinish, setSavingFinish] = useState<string | null>(null);
	const [countError, setCountError] = useState<string | null>(null);
	const [draftCounts, setDraftCounts] = useState({ nonfoil: "", foil: "" });
	const { showNotification } = useNotification();
	const synchronizeInputs = async () => {
		let success = true;
		for (const finish of ["nonfoil", "foil"] as const) {
			const value = Math.max(0, Number(draftCounts[finish]) || 0);
			if (value !== counts[finish]) {
				await saveCount(finish, value);
				if (countError) success = false;
			}
		}
		return success;
	};
	onSynchronize?.(synchronizeInputs);
	const goBackToSearch = () => {
		if (onBack) {
			void synchronizeInputs().then((success) => {
				if (success) onBack();
			});
			return;
		}
		window.history.back();
	};
	const card = useQuery({
		...cardQueryOptions(id),
		select: (result) => result as Card,
	});
	const printings = useQuery({
		...cardPrintingsQueryOptions(card.data?.oracle_id ?? ""),
		select: (result) => result.data as Printing[],
	});
	const loadCollectionCounts = async (printingId: string) => {
		const items = await getCollectionItemsForPrinting({ data: { printingId } });
		setCounts({
			nonfoil: items
				.filter((item) => item.finish === "nonfoil")
				.reduce((sum, item) => sum + item.quantity, 0),
			foil: items
				.filter((item) => item.finish === "foil")
				.reduce((sum, item) => sum + item.quantity, 0),
		});
		setDraftCounts({
			nonfoil: String(
				items
					.filter((item) => item.finish === "nonfoil")
					.reduce((sum, item) => sum + item.quantity, 0),
			),
			foil: String(
				items
					.filter((item) => item.finish === "foil")
					.reduce((sum, item) => sum + item.quantity, 0),
			),
		});
		setCountsLoadedFor(printingId);
	};

	const saveCount = async (finish: "nonfoil" | "foil", value: number) => {
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
		} catch (error) {
			setCountError(
				error instanceof Error
					? error.message
					: "Unable to save collection count.",
			);
		} finally {
			setSavingFinish(null);
		}
	};

	if (card.isPending)
		return (
			<output className="text-muted-foreground">Loading card details...</output>
		);
	if (card.isError)
		return (
			<div className="space-y-4">
				<p className="text-destructive">
					{card.error instanceof Error
						? card.error.message
						: "Could not load this card."}
				</p>
				{showNavigation && <Button
					variant="outline"
					onClick={goBackToSearch}
					className="cursor-pointer"
				>
					Back to search
				</Button>}
			</div>
		);

	const data = card.data;
	const printingOptions =
		printings.data?.filter((printing) => printing.id !== data.id) ?? [];
	const displayedCard = selectedPrinting ?? data;
	const faces = displayedCard.card_faces?.length
		? displayedCard.card_faces
		: [undefined];
	if (countsLoadedFor !== displayedCard.id) {
		void loadCollectionCounts(displayedCard.id);
	}
	return (
		<section className="mx-auto max-w-5xl space-y-6">
			{showNavigation && <button
				type="button"
				onClick={goBackToSearch}
				className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
			>
				← Back to search
			</button>}
			<div className="grid gap-8 md:grid-cols-[minmax(16rem,24rem)_1fr]">
				<div className="min-w-0 self-start">
					<div className="flex flex-wrap gap-4">
						{faces.map((face, index) => {
							const image = imageFor(displayedCard, face);
							return image ? (
								<img
									key={image}
									src={image}
									alt={face?.name ?? displayedCard.name ?? "Magic card"}
									className="w-full max-w-sm rounded-2xl shadow-lg ring-1 ring-border"
								/>
							) : (
								<div
									key={image ?? `face-${index}`}
									className="flex aspect-5/7 w-full max-w-sm items-center justify-center rounded-2xl bg-muted text-muted-foreground"
								>
									No image available
								</div>
							);
						})}
					</div>
				</div>
				<div className="space-y-5">
					{showVersionsEnabled && <div className="space-y-3">
						<button
							type="button"
							disabled={printings.isPending || printingOptions.length === 0}
							onClick={() => setShowVersions((visible) => !visible)}
							className="rounded-md border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
						>
							{printings.isPending
								? "Loading versions..."
								: showVersions
									? "Hide versions"
									: "Show versions"}
						</button>
						{showVersions && printingOptions.length > 0 && (
							<div className="max-h-[32rem] overflow-y-auto rounded-xl border bg-card p-3">
								<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
									{printingOptions.map((printing) => (
										<button
											key={printing.id}
											type="button"
											className="overflow-hidden rounded-lg border text-left text-sm hover:bg-muted"
											onClick={() =>
												navigate({
													to: "/cardDetails/$cardId",
													params: { cardId: printing.id },
												})
											}
										>
											<div className="aspect-[5/7] w-full bg-muted">
												{imageFor(printing) ? (
													<img
														src={imageFor(printing)}
														alt={printing.name ?? "Card printing"}
														className="h-full w-full object-cover"
													/>
												) : (
													<div className="flex h-full items-center justify-center px-2 text-center text-xs text-muted-foreground">
														No image
													</div>
												)}
											</div>
											<div className="space-y-1 p-2">
												<p className="truncate font-medium">
													{printing.set_name ?? printing.set}
												</p>
												<p className="truncate text-xs text-muted-foreground">
													{printing.collector_number} ·{" "}
													{printing.released_at ?? "Unknown"}
												</p>
											</div>
										</button>
									))}
								</div>
							</div>
						)}
					</div>}
					<header>
						<h1 className="text-4xl font-semibold tracking-tight">
							{displayedCard.name}
						</h1>
						<p className="mt-2 text-muted-foreground">
							{displayedCard.set_name} · {displayedCard.collector_number}
						</p>
					</header>
					<div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-2">
						{(["nonfoil", "foil"] as const).map((finish) => (
							<label className="space-y-1 text-sm" key={finish}>
								<span className="font-medium">
									{finish === "foil" ? "Foil cards" : "Normal cards"}
								</span>
								<input
									className="h-9 w-full rounded-md border bg-background px-3"
									disabled={savingFinish === finish}
									min="0"
									type="number"
									value={draftCounts[finish]}
									onChange={(event) =>
										setDraftCounts((current) => ({
											...current,
											[finish]: event.target.value,
										}))
									}
								/>
							</label>
						))}
					</div>
					{countError && (
						<p className="text-sm text-destructive">{countError}</p>
					)}
					<div className="grid gap-3 rounded-xl border bg-card p-4 text-sm sm:grid-cols-2">
						<p>
							<strong>Set:</strong> {displayedCard.set?.toUpperCase()}
						</p>
						<p>
							<strong>Rarity:</strong> {displayedCard.rarity}
						</p>
						<p>
							<strong>Released:</strong>{" "}
							{displayedCard.released_at ?? "Unknown"}
						</p>
						<p>
							<strong>Artist:</strong> {displayedCard.artist ?? "Unknown"}
						</p>
					</div>
					{faces.map((face, index) => (
						<div key={face?.name ?? `face-${index}`} className="space-y-2">
							{face?.name && (
								<h2 className="text-xl font-semibold">{face.name}</h2>
							)}
							<p className="font-medium">
								{face?.mana_cost ?? displayedCard.mana_cost ?? ""}
							</p>
							<p className="text-muted-foreground">
								{face?.type_line ?? displayedCard.type_line}
							</p>
							<p className="whitespace-pre-line">
								{face?.oracle_text ?? displayedCard.oracle_text}
							</p>
							{!face && displayedCard.power && (
								<p className="text-right font-medium">
									{displayedCard.power}/{displayedCard.toughness}
								</p>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default CardDetailsView;
