import { CalendarDays, Layers3 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { formatReleaseDate } from "./set-utils";
import type { SetSummary } from "./set-types";

const setCardsLink = (code: string) => ({ to: "/cards" as const, search: { set: code } });

export function SetRow({ set, depth = 0 }: { set: SetSummary; depth?: number }) {
	const completion = set.totalCards ? Math.min(100, Math.round((set.ownedCards / set.totalCards) * 100)) : 0;

	return (
		<Link {...setCardsLink(set.code)} className={`relative grid gap-2 border-b px-4 py-3 last:border-b-0 hover:bg-muted/40 focus-visible:bg-muted/40 sm:grid-cols-[minmax(0,1fr)_8rem_8rem_12rem] sm:items-center sm:gap-4 ${depth ? "pl-10" : ""}`} style={depth ? { paddingLeft: `${depth * 24 + 16}px` } : undefined}>
			{depth > 0 && <span aria-hidden="true" className="absolute top-0 h-1/2 w-4 border-b border-l border-muted-foreground/20" style={{ left: `${depth * 24}px` }} />}
			<div className="flex min-w-0 items-center gap-3">
				<SetIcon set={set} />
				<div className="min-w-0"><p className="truncate font-semibold">{set.name}</p><p className="truncate text-xs text-muted-foreground"><span className="font-mono uppercase">{set.code}</span></p></div>
			</div>
			<div className="text-sm text-muted-foreground"><span className="sm:hidden">Cards: </span>{set.totalCards}</div>
			<div className="flex items-center gap-1 text-sm text-muted-foreground"><CalendarDays className="size-3.5 sm:hidden" />{formatReleaseDate(set.releasedAt)}</div>
			<div className="flex items-center gap-3 sm:justify-end"><div className="min-w-0 flex-1 sm:max-w-28"><div className="mb-1 flex justify-between text-xs"><span>{set.ownedCards} owned</span><span>{completion}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${completion}%` }} /></div></div><span className="hidden text-xs text-muted-foreground sm:inline">{set.ownedCopies} copies</span></div>
		</Link>
	);
}

function SetIcon({ set }: { set: SetSummary }) {
	return set.iconUrl ? <img alt="" className="size-8 shrink-0 object-contain dark:invert" loading="lazy" src={set.iconUrl} /> : <div className="flex size-8 shrink-0 items-center justify-center rounded bg-muted"><Layers3 className="size-4 text-muted-foreground" /></div>;
}
