import { z } from "zod";

export const cardSearchInput = z.object({
	query: z.string().trim().min(1).max(100),
	unique: z.enum(["cards", "art", "prints"]).default("cards"),
	page: z.number().int().min(1).max(100).default(1),
});

export const scryfallCardSchema = z.object({
	id: z.string(),
	oracle_id: z.string().optional(),
	name: z.string(),
	set: z.string(),
	set_name: z.string(),
	collector_number: z.string(),
	lang: z.string(),
	released_at: z.string().optional(),
	rarity: z.string(),
	image_uris: z.record(z.string(), z.string()).optional(),
});

export type CardSearchInput = z.infer<typeof cardSearchInput>;
export type ScryfallCard = z.infer<typeof scryfallCardSchema>;
