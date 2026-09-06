import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SetCardView } from "./set-card-view";

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => vi.fn(),
}));

vi.mock("#/components/notification", () => ({
	useNotification: () => ({ showNotification: vi.fn() }),
}));

vi.mock("./collection.api", () => ({
	addCollectionItemByScryfallId: vi.fn(),
	getOwnedScryfallIds: vi.fn(),
}));

vi.mock("./card-details-modal", () => ({
	CardDetailsModal: () => null,
}));

describe("SetCardView", () => {
	it("shows unique card completion regardless of copies or finish", () => {
		render(
			<SetCardView
				result={{
					total_cards: 3,
					data: [],
					ownedCards: [
						{ scryfallId: "card-1", finish: "nonfoil", quantity: 4 },
						{ scryfallId: "card-1", finish: "foil", quantity: 2 },
						{ scryfallId: "card-2", finish: "foil", quantity: 2 },
					],
				}}
				set="tst"
			/>,
		);

		expect(screen.getByText("Cards").parentElement).toHaveTextContent(
			"Cards 2/3",
		);
		expect(screen.queryByText("Owned")).not.toBeInTheDocument();
		expect(screen.queryByText("Foils")).not.toBeInTheDocument();
	});

	it("does not count cards from another set", () => {
		render(
			<SetCardView
				result={{
					total_cards: 3,
					data: [],
					ownedCards: [
						{ scryfallId: "card-1", finish: "nonfoil", quantity: 2 },
					],
				}}
				set="tst"
			/>,
		);

		expect(screen.getByText("Cards").parentElement).toHaveTextContent(
			"Cards 1/3",
		);
	});
});
