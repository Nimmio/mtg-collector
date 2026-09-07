import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";

import { cardSearchQueryOptions } from "#/card/queries/card.queries";
import type {
	SearchCardViewController,
	SearchResult,
	SortDirection,
	SortOption,
} from "#/features/searchCard/SearchCardView.types";
import { Route } from "#/routes/_authenticated/searchCards";

const cardsPerPage = 175;

export function useSearchCardView(): SearchCardViewController {
	const navigate = useNavigate();
	const searchParams = Route.useSearch();
	const query = searchParams.query;
	const page = searchParams.page;
	const [input, setInput] = useState(query);
	const [sort, setSort] = useState<SortOption>(searchParams.sort as SortOption);
	const [direction, setDirection] = useState<SortDirection>(
		searchParams.direction as SortDirection,
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

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const nextQuery = input.trim();
		if (!nextQuery) return;
		navigate({
			to: ".",
			search: { query: nextQuery, page: 1, sort, direction },
		});
	}

	function onSortChange(value: string) {
		const nextSort = value as SortOption;
		setSort(nextSort);
		navigate({
			to: ".",
			search: { query, page: 1, sort: nextSort, direction },
		});
	}

	function onDirectionChange(value: string) {
		const nextDirection = value as SortDirection;
		setDirection(nextDirection);
		navigate({
			to: ".",
			search: { query, page: 1, sort, direction: nextDirection },
		});
	}

	function onPageChange(nextPage: number) {
		navigate({ to: ".", search: { query, page: nextPage, sort, direction } });
	}

	const result = search.data;

	return {
		query,
		page,
		input,
		sort,
		direction,
		result,
		isFetching: search.isFetching,
		isError: search.isError,
		error: search.error,
		totalPages: result ? Math.ceil(result.total_cards / cardsPerPage) : 0,
		onInputChange: setInput,
		onSubmit,
		onSortChange,
		onDirectionChange,
		onPageChange,
	};
}
