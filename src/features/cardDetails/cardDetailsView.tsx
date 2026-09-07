import { Button } from "#/components/ui/button";
import type { CardDetailsViewProps } from "#/features/cardDetails/CardDetailsView.types";
import { useCardDetailsView } from "#/features/cardDetails/useCardDetailsView";

function imageFor(
	card: NonNullable<ReturnType<typeof useCardDetailsView>["displayedCard"]>,
	face?: NonNullable<NonNullable<(typeof card)["card_faces"]>>[number],
) {
	return (
		face?.image_uris?.large ??
		card.image_uris?.large ??
		face?.image_uris?.normal ??
		card.image_uris?.normal
	);
}

export default function CardDetailsView({
	id,
	onSynchronize,
	onBack,
	showNavigation = true,
	showVersions: showVersionsEnabled = true,
}: CardDetailsViewProps) {
	const controller = useCardDetailsView({ id, onSynchronize, onBack });
	const {
		card,
		printings,
		displayedCard,
		printingOptions,
		showVersions,
		draftCounts,
		savingFinish,
		countError,
		onBack: handleBack,
		onToggleVersions,
		onPrintingSelect,
		onDraftCountChange,
	} = controller;

	if (card.isPending)
		return (
			<output className="text-muted-foreground">Loading card details...</output>
		);
	if (card.isError) {
		return (
			<div className="space-y-4">
				<p className="text-destructive">
					{card.error instanceof Error
						? card.error.message
						: "Could not load this card."}
				</p>
				{showNavigation && (
					<Button
						variant="outline"
						onClick={handleBack}
						className="cursor-pointer"
					>
						Back to search
					</Button>
				)}
			</div>
		);
	}

	if (!displayedCard) return null;
	const faces = displayedCard.card_faces?.length
		? displayedCard.card_faces
		: [undefined];

	return (
		<section className="mx-auto max-w-5xl space-y-6">
			{showNavigation && (
				<button
					type="button"
					onClick={handleBack}
					className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
				>
					Back to search
				</button>
			)}
			<div className="grid gap-8 md:grid-cols-[minmax(16rem,24rem)_1fr]">
				<div className="min-w-0 self-start">
					<div className="flex flex-wrap gap-4">
						{faces.map((face) => {
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
									key={face?.name ?? "no-image"}
									className="flex aspect-5/7 w-full max-w-sm items-center justify-center rounded-2xl bg-muted text-muted-foreground"
								>
									No image available
								</div>
							);
						})}
					</div>
				</div>
				<div className="space-y-5">
					{showVersionsEnabled && (
						<div className="space-y-3">
							<button
								type="button"
								disabled={printings.isPending || printingOptions.length === 0}
								onClick={onToggleVersions}
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
												onClick={() => onPrintingSelect(printing.id)}
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
						</div>
					)}
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
										onDraftCountChange(finish, event.target.value)
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
}
