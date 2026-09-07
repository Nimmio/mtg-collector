import { m } from "#/paraglide/messages";
import type { SetSummary } from "./set-types";
import { formatReleaseDate } from "./set-utils";

/** Shows set identity and collection completion statistics. */
export function SetCardHeader({
	set,
	result,
	ownedCount,
	completion,
}: {
	set: string;
	result: { total_cards: number; setInfo?: SetSummary };
	ownedCount: number;
	completion: number;
}) {
	return (
		<header className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
			<div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex min-w-0 items-center gap-4">
					{result.setInfo?.iconUrl && (
						<img
							alt=""
							className="size-16 shrink-0 object-contain dark:invert"
							src={result.setInfo.iconUrl}
						/>
					)}
					<div className="min-w-0">
						<p className="island-kicker">{m.set_cards()}</p>
						<h1 className="display-title mt-1 truncate text-3xl font-bold tracking-tight">
							{result.setInfo?.name ?? (set || m.cards())}
						</h1>
						<p className="mt-1 font-mono text-sm uppercase text-muted-foreground">
							{result.setInfo?.code ?? set}
						</p>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:text-right">
					<span className="text-muted-foreground">
						{m.cards()}{" "}
						<strong className="ml-1 text-foreground">
							{ownedCount}/{result.total_cards}
						</strong>
					</span>
					<span className="text-muted-foreground">
						{m.released()}{" "}
						<strong className="ml-1 text-foreground">
							{formatReleaseDate(result.setInfo?.releasedAt ?? null)}
						</strong>
					</span>
					<span className="text-muted-foreground">
						{m.set_type()}{" "}
						<strong className="ml-1 text-foreground">
							{result.setInfo?.setType ?? m.unknown()}
						</strong>
					</span>
					<span className="text-muted-foreground">
						{m.complete()}{" "}
						<strong className="ml-1 text-foreground">{completion}%</strong>
					</span>
					<div className="col-span-2 flex items-center gap-2 sm:col-span-2 sm:justify-end">
						<div
							aria-label={m.complete_percent({ percent: completion })}
							aria-valuemax={100}
							aria-valuemin={0}
							aria-valuenow={completion}
							className="h-2 w-full max-w-40 overflow-hidden rounded-full bg-muted"
							role="progressbar"
						>
							<div
								className="h-full rounded-full bg-primary transition-[width]"
								style={{ width: `${completion}%` }}
							/>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
