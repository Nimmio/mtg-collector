import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CardDetailsModal } from "./card-details-modal";

vi.mock("#/components/notification", () => ({
	useNotification: () => ({ showNotification: vi.fn() }),
}));

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => vi.fn(),
}));

vi.mock("#/features/cardDetails/cardDetailsView", () => ({
	default: ({ id }: { id: string }) => <p>Card details: {id}</p>,
}));
describe("CardDetailsModal", () => {
	it("renders the selected card and closes from the button", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();

		render(<CardDetailsModal cardId="card-1" onClose={onClose} />);

		expect(screen.getByRole("dialog")).toBeInTheDocument();
		expect(screen.getByText("Card details: card-1")).toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: "Close" }));

		expect(onClose).toHaveBeenCalledOnce();
	});

	it("waits for a successful synchronization before closing", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();
		render(<CardDetailsModal cardId="card-1" onClose={onClose} />);
		await user.click(screen.getByRole("button", { name: "Close" }));
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("closes when Escape is pressed or the backdrop is clicked", async () => {
		const user = userEvent.setup();
		const onClose = vi.fn();

		const { rerender } = render(
			<CardDetailsModal cardId="card-1" onClose={onClose} />,
		);
		await user.keyboard("{Escape}");
		const backdrop = screen.getByRole("dialog");
		await user.click(backdrop);

		expect(onClose).toHaveBeenCalledOnce();
		rerender(<CardDetailsModal cardId="card-1" onClose={onClose} />);
		await user.click(screen.getByText("Card details: card-1"));
		expect(onClose).toHaveBeenCalledOnce();
	});
});
