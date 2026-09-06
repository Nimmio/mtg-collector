import { createContext, useContext, useEffect, useState } from "react";

type Notification = { id: number; message: string };
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
	const [notification, setNotification] = useState<Notification | null>(null);

	useEffect(() => {
		if (!notification) return;
		const timeout = window.setTimeout(() => setNotification(null), 3000);
		return () => window.clearTimeout(timeout);
	}, [notification]);

	return (
		<NotificationContext.Provider
			value={{
				showNotification: (message) =>
					setNotification({ id: Date.now(), message }),
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
