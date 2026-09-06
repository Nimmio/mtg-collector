import { Queue } from "bullmq";

import { env } from "../env.js";

export const CARD_IMPORT_QUEUE = "card-import";
export const CARD_IMPORT_JOB = "bulk-default-cards";

export const cardImportQueue = new Queue(CARD_IMPORT_QUEUE, {
	connection: { url: env.REDIS_URL },
});

/** Enqueues the idempotent bulk import job for default card data. */
export function enqueueBulkCardImport() {
	return cardImportQueue.add(
		CARD_IMPORT_JOB,
		{},
		{
			jobId: CARD_IMPORT_JOB,
			attempts: 3,
			backoff: { type: "exponential", delay: 5000 },
			removeOnComplete: true,
			removeOnFail: false,
		},
	);
}
