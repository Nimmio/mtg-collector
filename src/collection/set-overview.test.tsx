import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SetOverview } from "./set-overview";

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children }: { children: React.ReactNode }) => (
		<a href="/cards">{children}</a>
	),
}));

const sets = [
	{
		code: "a",
		name: "Alpha",
		releasedAt: "2020-01-01",
		totalCards: 10,
		ownedCards: 5,
		ownedCopies: 5,
		iconUrl: null,
		setType: "core",
		group: null,
		groupCode: null,
		parentSetCode: null,
		groupKey: null,
		groupName: null,
	},
	{
		code: "b",
		name: "Beta",
		releasedAt: "2021-01-01",
		totalCards: 20,
		ownedCards: 10,
		ownedCopies: 10,
		iconUrl: null,
		setType: "expansion",
		group: null,
		groupCode: null,
		parentSetCode: null,
		groupKey: null,
		groupName: null,
	},
];

describe("SetOverview", () => {
	it("filters sets by name and set type", async () => {
		const user = userEvent.setup();
		render(<SetOverview sets={sets} />);
		await user.type(screen.getByRole("textbox", { name: "Find sets" }), "beta");
		expect(screen.getByText("Beta")).toBeInTheDocument();
		expect(screen.queryByText("Alpha")).not.toBeInTheDocument();
		expect(screen.getByText("1 of 2 sets")).toBeInTheDocument();
	});
});
