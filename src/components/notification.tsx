import { createContext, useContext } from "react";

import { useNotificationState } from "#/components/useNotification";

type NotificationContextValue = { showNotification: (message: string) => void };

const NotificationContext = createContext<NotificationContextValue | null>(
	null,
);

/** Provides transient, automatically dismissed notifications to descendant components. */
export function NotificationProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { notification, showNotification } = useNotificationState();

	return (
		<NotificationContext.Provider
			value={{
				showNotification,
			}}
		>
			{children}
			{notification && (
				<output
					key={notification.id}
					aria-live="polite"
					className="fixed right-4 bottom-4 z-50 max-w-sm rounded-lg border bg-card px-4 py-3 text-sm font-medium text-card-foreground shadow-lg"
				>
					{notification.message}
				</output>
			)}
		</NotificationContext.Provider>
	);
}

/** Returns the notification API and enforces provider usage. */
export function useNotification() {
	const context = useContext(NotificationContext);
	if (!context)
		throw new Error("useNotification must be used within NotificationProvider");
	return context;
}
