/** Recursively converts Prisma Decimal values into JSON-safe numbers. */
// biome-ignore lint/suspicious/noExplicitAny: required to expose the mapped serializable shape
export function serializePrisma<T>(value: T): any {
	if (value && typeof value === "object" && "toNumber" in value) {
		return (value as { toNumber: () => number }).toNumber() as T;
	}

	if (Array.isArray(value)) {
		return value.map(serializePrisma) as T;
	}

	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).map(([key, entry]) => [
				key,
				serializePrisma(entry),
			]),
		) as T;
	}

	return value;
}
