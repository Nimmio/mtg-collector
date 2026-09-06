import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combines conditional class names and resolves Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
