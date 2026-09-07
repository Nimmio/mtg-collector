import { describe, expect, it } from "vitest";
import { uniqueCardResults } from "./card-results";

describe("uniqueCardResults", () => {
	it("keeps one result for a double-faced card", () => {
		const cards = [
			{ id: "front", oracle_id: "shared" },
			{ id: "back", oracle_id: "shared" },
			{ id: "other", oracle_id: "other" },
		];

		expect(uniqueCardResults(cards)).toEqual([cards[0], cards[2]]);
	});
});
