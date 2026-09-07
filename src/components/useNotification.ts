import { useEffect, useState } from "react";

type Notification = { id: number; message: string };

export function useNotificationState() {
	const [notification, setNotification] = useState<Notification | null>(null);

	useEffect(() => {
		if (!notification) return;
		const timeout = window.setTimeout(() => setNotification(null), 3000);
		return () => window.clearTimeout(timeout);
	}, [notification]);

	return {
		notification,
		showNotification: (message: string) =>
			setNotification({ id: Date.now(), message }),
	};
}
