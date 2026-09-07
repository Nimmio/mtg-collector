import { Gem, Plus } from "lucide-react";
import { Button } from "#/components/ui/button";
import { m } from "#/paraglide/messages";

type Card = Record<string, string | object | undefined>;

/** Renders one card in either the grid or compact list presentation. */
export function SetCardItem({
	card,
	view,
	editMode,
	added,
	hasFoil,
	addingNormal,
	addingFoil,
	onOpen,
	onAdd,
}: {
	card: Card;
	view: "grid" | "list";
	editMode: boolean;
	added: boolean;
	hasFoil: boolean;
	addingNormal: boolean;
	addingFoil: boolean;
	onOpen: () => void;
	onAdd: (finish: "nonfoil" | "foil") => void;
}) {
	const image =
		(card.image_uris as Record<string, string> | undefined)?.normal ??
		(
			card.card_faces as
				| Array<{ image_uris?: Record<string, string> }>
				| undefined
		)?.[0]?.image_uris?.normal;
	return (
		<article
			className={`group relative block w-full overflow-hidden text-left transition duration-300 hover:-translate-y-1 hover:shadow-xl ${view === "grid" ? "cursor-pointer rounded-2xl border bg-card shadow-sm" : "flex cursor-pointer items-center gap-4 rounded-xl border bg-card p-3 shadow-sm"}`}
		>
			<button
				aria-label={m.view_card_details({
					name: String(card.name ?? m.magic_card()),
				})}
				className="block w-full cursor-pointer text-left"
				onClick={onOpen}
				type="button"
			>
				{image && (
					<img
						alt={String(card.name ?? m.magic_card())}
						className={
							view === "grid"
								? "aspect-[488/680] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
								: "size-16 rounded-lg object-cover"
						}
						loading="lazy"
						src={image}
					/>
				)}
			</button>
			{!added && (
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 bg-background/35 grayscale"
				/>
			)}
			{hasFoil && (
				<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,0,128,0.48)_5%,rgba(255,128,0,0.4)_25%,rgba(255,245,0,0.42)_42%,rgba(0,255,128,0.42)_58%,rgba(0,180,255,0.48)_75%,rgba(150,0,255,0.45)_95%)] mix-blend-screen opacity-90" />
			)}
			{editMode && (
				<div className="absolute inset-x-2 bottom-2 flex gap-2 rounded-xl border border-white/20 bg-black/55 p-1.5 shadow-lg backdrop-blur-md">
					<Button
						aria-label={addingNormal ? m.adding() : m.add_normal()}
						className="h-9 flex-1 cursor-pointer border-white/15 bg-white/95 text-slate-900 shadow-sm hover:scale-105 hover:bg-white dark:bg-white/95 dark:text-slate-900 dark:hover:bg-white"
						size="icon-sm"
						title={addingNormal ? m.adding() : m.add_normal()}
						disabled={addingNormal}
						onClick={() => onAdd("nonfoil")}
						type="button"
					>
						<Plus aria-hidden="true" />
					</Button>
					<Button
						aria-label={addingFoil ? m.adding() : m.add_foil()}
						className="h-9 flex-1 cursor-pointer border-amber-200/50 bg-gradient-to-r from-fuchsia-500 via-amber-400 to-cyan-400 text-white shadow-sm hover:scale-105 hover:brightness-110 dark:text-white"
						size="icon-sm"
						title={addingFoil ? m.adding() : m.add_foil()}
						disabled={addingFoil}
						onClick={() => onAdd("foil")}
						type="button"
					>
						<Gem aria-hidden="true" />
					</Button>
				</div>
			)}
			{view === "list" && (
				<div className="min-w-0">
					<p className="truncate font-semibold">
						{String(card.name ?? m.unknown())}
					</p>
					<p className="text-sm text-muted-foreground">
						{String(card.mana_cost ?? "")}
					</p>
				</div>
			)}
		</article>
	);
}
