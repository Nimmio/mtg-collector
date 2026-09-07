import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SetCardItem } from "./set-card-item";

vi.mock("#/paraglide/messages", () => ({
	m: {
		view_card_details: ({ name }: { name: string }) => `View ${name}`,
		magic_card: () => "Magic card",
		adding: () => "Adding",
		add_normal: () => "Add normal",
		add_foil: () => "Add foil",
		unknown: () => "Unknown",
	},
}));

describe("SetCardItem", () => {
	it("offers clearly differentiated normal and foil actions", async () => {
		const user = userEvent.setup();
		const onAdd = vi.fn();

		render(
			<SetCardItem
				added={false}
				addingFoil={false}
				addingNormal={false}
				card={{
					id: "card-1",
					name: "Test Card",
					image_uris: { normal: "/card.jpg" },
				}}
				editMode
				hasFoil
				onAdd={onAdd}
				onOpen={vi.fn()}
				view="grid"
			/>,
		);

		await user.click(screen.getByRole("button", { name: "Add foil" }));
		expect(onAdd).toHaveBeenCalledWith("foil");
		expect(screen.getByRole("button", { name: "Add normal" })).toBeVisible();
	});
});
