import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SearchCardView from "#/features/searchCard/searchCardView";

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children }: { children: React.ReactNode }) => (
		<a href="/card">{children}</a>
	),
	useNavigate: () => navigate,
}));

vi.mock("#/routes/_authenticated/searchCards", () => ({
	Route: {
		useSearch: () => ({
			query: "lightning",
			page: 1,
			sort: "name",
			direction: "auto",
		}),
	},
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@tanstack/react-query")>();
	return {
		...actual,
		useQuery: () => ({
			data: {
				total_cards: 1,
				has_more: false,
				data: [
					{
						id: "card-1",
						name: "Lightning Bolt",
						set_name: "Alpha",
					},
				],
			},
			isFetching: false,
			isError: false,
			error: null,
		}),
	};
});

describe("SearchCardView", () => {
	it("renders search results and submits a new query", async () => {
		render(<SearchCardView />);

		expect(
			screen.getByRole("heading", { name: "Find a card" }),
		).toBeInTheDocument();
		expect(screen.getByText("Lightning Bolt")).toBeInTheDocument();

		const form = screen.getByRole("button", { name: "Search cards" });
		expect(form).toBeEnabled();
	});
});
