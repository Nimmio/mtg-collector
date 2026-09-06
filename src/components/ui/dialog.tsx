import * as DialogPrimitive from "radix-ui";
import type * as React from "react";

import { cn } from "#/lib/utils.ts";

const Dialog = DialogPrimitive.Dialog.Root;
const DialogTrigger = DialogPrimitive.Dialog.Trigger;
const DialogPortal = DialogPrimitive.Dialog.Portal;
const DialogClose = DialogPrimitive.Dialog.Close;

function DialogOverlay({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Dialog.Overlay>) {
	return (
		<DialogPrimitive.Dialog.Overlay
			className={cn(
				"fixed inset-0 z-50 bg-black/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({
	className,
	children,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Dialog.Content>) {
	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogPrimitive.Dialog.Content
				className={cn(
					"fixed top-1/2 left-1/2 z-50 grid max-h-[90vh] w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-lg border border-border bg-background p-6 text-foreground shadow-lg duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:w-full",
					className,
				)}
				{...props}
			>
				{children}
			</DialogPrimitive.Dialog.Content>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			{...props}
		/>
	);
}

function DialogTitle({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Dialog.Title>) {
	return (
		<DialogPrimitive.Dialog.Title
			className={cn("text-lg font-semibold", className)}
			{...props}
		/>
	);
}

function DialogDescription({
	className,
	...props
}: React.ComponentProps<typeof DialogPrimitive.Dialog.Description>) {
	return (
		<DialogPrimitive.Dialog.Description
			className={cn("text-sm text-muted-foreground", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
