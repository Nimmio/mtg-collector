import { describe, expect, it } from "vitest";
import { formatCardPrice } from "./cardPrice";

describe("formatCardPrice", () => {
	it("formats the selected currency and finish", () => {
		expect(
			formatCardPrice({ usd: "1.25", eur: "2.5", eur_foil: "4" }, "EUR"),
		).toBe("€2.50");
		expect(formatCardPrice({ usd: "1.25", usd_foil: "3" }, "USD", true)).toBe(
			"$3.00",
		);
	});

	it("returns null when the selected price is unavailable", () => {
		expect(formatCardPrice({ usd: "1.25" }, "EUR")).toBeNull();
	});
});
