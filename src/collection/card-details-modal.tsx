import { useRef } from "react";
import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogFooter } from "#/components/ui/dialog";
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
		<DialogContent className="max-w-6xl border-primary/20 bg-background/95 p-4 shadow-2xl backdrop-blur-xl sm:p-7">
			<CardDetailsView
				id={cardId}
				showNavigation={false}
				showVersions={false}
				modal
				onSynchronize={(synchronize) => {
					synchronizeRef.current = synchronize;
				}}
			/>
			<DialogFooter className="border-t border-border/70 pt-4">
				<Button variant="outline" onClick={() => void close()}>
					{m.close()}
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}
