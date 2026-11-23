import { describe, expect, it } from "vitest";
import { INDIVIDUAL_PRICES, ORIGINAL_PACKAGE_PRICE, PACKAGE_SAVINGS } from "./individualPrices";
describe("Individual session prices", () => {
  it("charges 75 USD for one session", () => expect(INDIVIDUAL_PRICES.single).toBe(75));
  it("charges 203 USD for three sessions", () => { expect(INDIVIDUAL_PRICES.sessions).toBe(3); expect(INDIVIDUAL_PRICES.package).toBe(203); });
  it("calculates the original three-session price as 225 USD", () => expect(ORIGINAL_PACKAGE_PRICE).toBe(225));
  it("calculates savings of 22 USD", () => expect(PACKAGE_SAVINGS).toBe(22));
});
