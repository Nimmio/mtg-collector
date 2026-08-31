import { queryOptions } from "@tanstack/react-query";

import { getCollection, getCollectionItemById } from "../collection.api.js";

export const collectionQueryKeys = {
	all: ["collection"] as const,
	item: (id: string) => ["collection", id] as const,
};
export const collectionQueryOptions = () =>
	queryOptions({
		queryKey: collectionQueryKeys.all,
		queryFn: () => getCollection(),
	});
export const collectionItemQueryOptions = (id: string) =>
	queryOptions({
		queryKey: collectionQueryKeys.item(id),
		queryFn: () => getCollectionItemById({ data: { id } }),
	});
