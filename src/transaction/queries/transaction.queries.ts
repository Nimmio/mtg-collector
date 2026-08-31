import { queryOptions } from "@tanstack/react-query";

import { getTransactions } from "../transaction.api.js";

export const transactionQueryOptions = () =>
	queryOptions({
		queryKey: ["collection-transactions"],
		queryFn: () => getTransactions(),
	});
