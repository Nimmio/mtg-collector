import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";

import { cardSearchQueryOptions } from "#/card/queries/card.queries";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/select";
import { Route } from "#/routes/_authenticated/searchCards";

const sortOptions = [
	{ value: "name", label: "Name" },
	{ value: "released", label: "Release date" },
	{ value: "set", label: "Set" },
	{ value: "rarity", label: "Rarity" },
	{ value: "usd", label: "USD price" },
	{ value: "tix", label: "MTGO price" },
	{ value: "edhrec", label: "EDHREC rank" },
] as const;

type SearchCard = {
	id?: string;
	name?: string;
	set_name?: string;
	collector_number?: string;
	rarity?: string;
	released_at?: string;
	image_uris?: Record<string, string>;
	card_faces?: Array<{ image_uris?: Record<string, string> }>;
};

type SearchResult = {
	total_cards: number;
	has_more: boolean;
	data: SearchCard[];
};

const cardsPerPage = 175;

function cardImage(card: SearchCard) {
	return card.image_uris?.normal ?? card.card_faces?.[0]?.image_uris?.normal;
}

export default function SearchCardView() {
	const navigate = useNavigate();
	const searchParams = Route.useSearch();
	const query = searchParams.query;
	const page = searchParams.page;
	const [input, setInput] = useState(query);
	const [sort, setSort] = useState<(typeof sortOptions)[number]["value"]>(
		searchParams.sort as (typeof sortOptions)[number]["value"],
	);
	const [direction, setDirection] = useState<"auto" | "asc" | "desc">(
		searchParams.direction as "auto" | "asc" | "desc",
	);

	useEffect(() => {
		setInput(query);
	}, [query]);
	const search = useQuery({
		...cardSearchQueryOptions({
			query,
			unique: "cards",
			page,
			sort,
			direction,
		}),
		select: (result) => result as SearchResult,
	});

	function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const nextQuery = input.trim();
		if (!nextQuery) return;
		navigate({
			to: ".",
			search: { query: nextQuery, page: 1, sort, direction },
		});
	}

	function changeSort(value: string) {
		setSort(value as (typeof sortOptions)[number]["value"]);
		navigate({ to: ".", search: { query, page: 1, sort: value, direction } });
	}

	function changeDirection(value: string) {
		setDirection(value as "auto" | "asc" | "desc");
		navigate({ to: ".", search: { query, page: 1, sort, direction: value } });
	}

	const result = search.data;
	const totalPages = result ? Math.ceil(result.total_cards / cardsPerPage) : 0;

	return (
		<section className="mx-auto max-w-7xl space-y-8">
			<header className="space-y-2">
				<p className="text-sm font-medium tracking-[0.2em] text-primary uppercase">
					Scryfall explorer
				</p>
				<h1 className="text-4xl font-semibold tracking-tight">Find a card</h1>
				<p className="max-w-2xl text-muted-foreground">
					Search with Scryfall syntax, such as <code>lightning t:instant</code>{" "}
					or
					<code>set:mh3 r:mythic</code>.
				</p>
			</header>

			<div className="rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
				<form
					className="flex flex-col gap-3 lg:flex-row lg:items-end"
					onSubmit={submit}
				>
					<div className="min-w-0 flex-1 space-y-2">
						<label className="sr-only" htmlFor="card-search">
							Scryfall search query
						</label>
						<Input
							id="card-search"
							value={input}
							onChange={(event) => setInput(event.target.value)}
							placeholder="Search cards, e.g. lightning t:instant"
							className="h-11 w-full"
						/>
					</div>
					<div className="grid gap-3 sm:grid-cols-[auto_minmax(9rem,1fr)_auto_minmax(8rem,1fr)] sm:items-center lg:flex lg:items-center">
						<label className="text-sm font-medium" htmlFor="card-sort">
							Sort by
						</label>
						<Select value={sort} onValueChange={changeSort}>
							<SelectTrigger id="card-sort" className="w-full sm:w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{sortOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<label className="text-sm font-medium" htmlFor="card-direction">
							Order
						</label>
						<Select value={direction} onValueChange={changeDirection}>
							<SelectTrigger id="card-direction" className="w-full sm:w-36">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="auto">Default</SelectItem>
								<SelectItem value="asc">Ascending</SelectItem>
								<SelectItem value="desc">Descending</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<Button
						type="submit"
						size="lg"
						className="lg:shrink-0"
						disabled={!input.trim() || search.isFetching}
					>
						{search.isFetching ? "Searching..." : "Search cards"}
					</Button>
				</form>
				{search.isFetching && (
					<output className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
						<span
							className="size-3 animate-spin rounded-full border-2 border-primary border-t-transparent"
							aria-hidden="true"
						/>
						Loading cards...
					</output>
				)}
			</div>

			{search.isError && (
				<div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
					{search.error instanceof Error
						? search.error.message
						: "Scryfall could not complete that search."}
				</div>
			)}

			{result && (
				<div className="space-y-6 rounded-2xl border bg-card p-4 shadow-sm sm:p-6">
					<div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
						<p className="text-sm text-muted-foreground">
							{result.total_cards.toLocaleString()} result
							{result.total_cards === 1 ? "" : "s"} for <strong>{query}</strong>
						</p>
						{result.has_more && (
							<p className="text-sm text-muted-foreground">Page {page}</p>
						)}
					</div>

					{result.data.length === 0 ? (
						<div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
							No cards matched that query.
						</div>
					) : (
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
							{result.data.map((card, index) => {
								const image = cardImage(card);
								return (
									<article
										className="group space-y-3"
										key={card.id ?? `${card.name}-${index}`}
									>
										{card.id ? (
											<Link
												to="/cardDetails/$cardId"
												params={{ cardId: card.id }}
												aria-label={`View details for ${card.name ?? "Magic card"}`}
												className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
											>
												<div className="aspect-5/7 overflow-hidden rounded-xl bg-muted shadow-sm ring-1 ring-border">
													{image ? (
														<img
															src={image}
															alt={card.name ?? "Magic card"}
															loading="lazy"
															className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
														/>
													) : (
														<div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
															No image available
														</div>
													)}
												</div>
											</Link>
										) : (
											<div className="aspect-5/7 overflow-hidden rounded-xl bg-muted shadow-sm ring-1 ring-border">
												{image ? (
													<img
														src={image}
														alt={card.name ?? "Magic card"}
														loading="lazy"
														className="h-full w-full object-cover"
													/>
												) : (
													<div className="flex h-full items-center justify-center p-4 text-center text-sm text-muted-foreground">
														No image available
													</div>
												)}
											</div>
										)}
										<div>
											<h2 className="truncate font-medium" title={card.name}>
												{card.name ?? "Unnamed card"}
											</h2>
											<p className="truncate text-sm text-muted-foreground">
												{card.set_name ?? "Unknown set"}
												{card.collector_number
													? ` · ${card.collector_number}`
													: ""}
											</p>
										</div>
									</article>
								);
							})}
						</div>
					)}

					{totalPages > 1 && (
						<div className="flex flex-wrap items-center justify-center gap-3">
							<Button
								type="button"
								variant="outline"
								disabled={page === 1 || search.isFetching}
								onClick={() =>
									navigate({
										to: ".",
										search: { query, page: page - 1, sort, direction },
									})
								}
							>
								Previous
							</Button>
							<Button
								type="button"
								variant="outline"
								disabled={!result.has_more || search.isFetching}
								onClick={() =>
									navigate({
										to: ".",
										search: { query, page: page + 1, sort, direction },
									})
								}
							>
								Next
							</Button>
							<Select
								value={String(page)}
								onValueChange={(value) =>
									navigate({
										to: ".",
										search: {
											query,
											page: Number(value),
											sort,
											direction,
										},
									})
								}
							>
								<SelectTrigger className="w-32" aria-label="Select page">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Array.from(
										{ length: totalPages },
										(_, index) => index + 1,
									).map((pageNumber) => (
										<SelectItem key={pageNumber} value={String(pageNumber)}>
											Page {pageNumber}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}
				</div>
			)}
		</section>
	);
}
