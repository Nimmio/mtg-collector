import { useRef } from "react";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import CardDetailsView from "#/features/cardDetails/cardDetailsView";
import { m } from "#/paraglide/messages";

type CardDetailsModalProps = {
	cardId: string;
	onClose: () => void | Promise<void>;
};

/** Presents card details in a modal and synchronizes collection changes on close. */
export function CardDetailsModal({ cardId, onClose }: CardDetailsModalProps) {
	return (
		<Dialog open onOpenChange={(open) => !open && void onClose()}>
			<CardDetailsModalContent cardId={cardId} onClose={onClose} />
		</Dialog>
	);
}

function CardDetailsModalContent({ cardId, onClose }: CardDetailsModalProps) {
	const synchronizeRef = useRef<(() => Promise<boolean>) | null>(null);
	const close = async () => {
		const success = (await synchronizeRef.current?.()) ?? true;
		if (success) await onClose();
	};

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>{m.card_details()}</DialogTitle>
				<DialogDescription>{m.review_card()}</DialogDescription>
			</DialogHeader>
			<CardDetailsView
				id={cardId}
				showNavigation={false}
				showVersions={false}
				onSynchronize={(synchronize) => {
					synchronizeRef.current = synchronize;
				}}
			/>
			<DialogFooter>
				<Button variant="outline" onClick={() => void close()}>
					{m.close()}
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}
