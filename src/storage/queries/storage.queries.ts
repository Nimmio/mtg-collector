import { queryOptions } from "@tanstack/react-query";

import { getStorageLocations } from "../storage.api.js";

export const storageQueryOptions = () =>
	queryOptions({
		queryKey: ["storage-locations"],
		queryFn: () => getStorageLocations(),
	});
