import { createClient, type RedisClientType } from "redis";

import { env } from "./env.js";

type RedisClient = RedisClientType;

declare global {
	var __redis: RedisClient | undefined;
	var __redisConnection: Promise<RedisClient> | undefined;
}

export function getRedis(): Promise<RedisClient> {
	if (globalThis.__redis?.isReady) {
		return Promise.resolve(globalThis.__redis);
	}

	if (!globalThis.__redisConnection) {
		const client = createClient({ url: env.REDIS_URL });
		client.on("error", (error) => {
			console.error("Redis error:", error);
		});

		globalThis.__redisConnection = client
			.connect()
			.then(() => {
				globalThis.__redis = client;
				return client;
			})
			.catch((error) => {
				globalThis.__redisConnection = undefined;
				throw error;
			});
	}

	return globalThis.__redisConnection;
}

/** Reads and parses a cached JSON value, treating Redis failures as cache misses. */
export async function redisGet<T>(key: string): Promise<T | null> {
	try {
		const redis = await getRedis();
		const value = await redis.get(key);
		return value ? (JSON.parse(value) as T) : null;
	} catch (error) {
		console.warn(`Redis read failed for ${key}:`, error);
		return null;
	}
}

/** Stores a JSON value with a caller-provided expiration time. */
export async function redisSet<T>(key: string, value: T, ttlSeconds: number) {
	try {
		const redis = await getRedis();
		await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
	} catch (error) {
		console.warn(`Redis write failed for ${key}:`, error);
	}
}
