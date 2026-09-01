import { useQuery } from "@tanstack/react-query";

import { cardQueryOptions } from "#/card/queries/card.queries";
import { Button } from "#/components/ui/button";

type CardDetailsViewProps = { id: string };

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
	card_faces?: Array<{
		name?: string;
		image_uris?: Record<string, string>;
		mana_cost?: string;
		type_line?: string;
		oracle_text?: string;
	}>;
};

function imageFor(card: Card, face?: NonNullable<Card["card_faces"]>[number]) {
	return (
		face?.image_uris?.large ??
		card.image_uris?.large ??
		face?.image_uris?.normal ??
		card.image_uris?.normal
	);
}

const CardDetailsView = ({ id }: CardDetailsViewProps) => {
	const goBackToSearch = () => window.history.back();
	const card = useQuery({
		...cardQueryOptions(id),
		select: (result) => result as Card,
	});

	if (card.isPending)
		return (
			<p role="status" className="text-muted-foreground">
				Loading card details...
			</p>
		);
	if (card.isError)
		return (
			<div className="space-y-4">
				<p className="text-destructive">
					{card.error instanceof Error
						? card.error.message
						: "Could not load this card."}
				</p>
				<Button
					variant="outline"
					onClick={goBackToSearch}
					className="cursor-pointer"
				>
					Back to search
				</Button>
			</div>
		);

	const data = card.data;
	const faces = data.card_faces?.length ? data.card_faces : [undefined];
	return (
		<section className="mx-auto max-w-5xl space-y-6">
			<button
				type="button"
				onClick={goBackToSearch}
				className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
			>
				← Back to search
			</button>
			<div className="grid gap-8 md:grid-cols-[minmax(16rem,24rem)_1fr]">
				<div className="flex flex-wrap gap-4">
					{faces.map((face, index) => {
						const image = imageFor(data, face);
						return image ? (
							<img
								key={image}
								src={image}
								alt={face?.name ?? data.name ?? "Magic card"}
								className="w-full max-w-sm rounded-2xl shadow-lg ring-1 ring-border"
							/>
						) : (
							<div
								key={index}
								className="flex aspect-5/7 w-full max-w-sm items-center justify-center rounded-2xl bg-muted text-muted-foreground"
							>
								No image available
							</div>
						);
					})}
				</div>
				<div className="space-y-5">
					<header>
						<h1 className="text-4xl font-semibold tracking-tight">
							{data.name}
						</h1>
						<p className="mt-2 text-muted-foreground">
							{data.set_name} · {data.collector_number}
						</p>
					</header>
					<div className="grid gap-3 rounded-xl border bg-card p-4 text-sm sm:grid-cols-2">
						<p>
							<strong>Set:</strong> {data.set?.toUpperCase()}
						</p>
						<p>
							<strong>Rarity:</strong> {data.rarity}
						</p>
						<p>
							<strong>Released:</strong> {data.released_at ?? "Unknown"}
						</p>
						<p>
							<strong>Artist:</strong> {data.artist ?? "Unknown"}
						</p>
					</div>
					{faces.map((face, index) => (
						<div key={index} className="space-y-2">
							{face?.name && (
								<h2 className="text-xl font-semibold">{face.name}</h2>
							)}
							<p className="font-medium">
								{face?.mana_cost ?? data.mana_cost ?? ""}
							</p>
							<p className="text-muted-foreground">
								{face?.type_line ?? data.type_line}
							</p>
							<p className="whitespace-pre-line">
								{face?.oracle_text ?? data.oracle_text}
							</p>
							{!face && data.power && (
								<p className="text-right font-medium">
									{data.power}/{data.toughness}
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
