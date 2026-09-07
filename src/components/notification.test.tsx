import { act, render, renderHook, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
	NotificationProvider,
	useNotification,
} from "#/components/notification";
import { useNotificationState } from "#/components/useNotification";

describe("notification state", () => {
	it("shows and dismisses a notification", () => {
		vi.useFakeTimers();
		const { result } = renderHook(() => useNotificationState());

		act(() => result.current.showNotification("Saved"));
		expect(result.current.notification?.message).toBe("Saved");
		act(() => vi.advanceTimersByTime(3000));
		expect(result.current.notification).toBeNull();
		vi.useRealTimers();
	});
});

describe("NotificationProvider", () => {
	it("renders notifications through the context API", () => {
		function Trigger() {
			const { showNotification } = useNotification();
			return (
				<button type="button" onClick={() => showNotification("Saved")}>
					Save
				</button>
			);
		}

		render(
			<NotificationProvider>
				<Trigger />
			</NotificationProvider>,
		);

		act(() => screen.getByRole("button", { name: "Save" }).click());
		expect(screen.getByText("Saved")).toBeInTheDocument();
	});
});
