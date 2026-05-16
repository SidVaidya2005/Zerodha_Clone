import {
  getCurrentValue,
  getPnL,
  getProfitClass,
  getDayClass,
  parseNumericPrice,
  formatPrice,
  formatPercent,
} from "./portfolioUtils";

describe("portfolioUtils", () => {
  describe("getCurrentValue", () => {
    it("multiplies price by qty", () => {
      expect(getCurrentValue({ price: 100, qty: 5 })).toBe(500);
    });
  });

  describe("getPnL", () => {
    it("returns positive when price exceeds avg", () => {
      expect(getPnL({ price: 110, qty: 5, avg: 100 })).toBe(50);
    });

    it("returns negative when price is below avg", () => {
      expect(getPnL({ price: 90, qty: 5, avg: 100 })).toBe(-50);
    });
  });

  describe("getProfitClass", () => {
    it("returns 'profit' for non-negative pnl", () => {
      expect(getProfitClass(0)).toBe("profit");
      expect(getProfitClass(10)).toBe("profit");
    });

    it("returns 'loss' for negative pnl", () => {
      expect(getProfitClass(-1)).toBe("loss");
    });
  });

  describe("getDayClass", () => {
    it("maps isLoss=true to 'loss', isLoss=false to 'profit'", () => {
      expect(getDayClass(true)).toBe("loss");
      expect(getDayClass(false)).toBe("profit");
    });
  });

  describe("parseNumericPrice", () => {
    it("returns finite numbers unchanged", () => {
      expect(parseNumericPrice(123.45)).toBe(123.45);
    });

    it("parses strings with thousands separators", () => {
      expect(parseNumericPrice("1,234.56")).toBe(1234.56);
    });

    it("returns 0 for unparseable strings", () => {
      expect(parseNumericPrice("foo")).toBe(0);
    });

    it("returns 0 for nullish or non-string non-number inputs", () => {
      expect(parseNumericPrice(null)).toBe(0);
      expect(parseNumericPrice(undefined)).toBe(0);
      expect(parseNumericPrice({})).toBe(0);
    });

    it("returns 0 for non-finite numbers", () => {
      expect(parseNumericPrice(NaN)).toBe(0);
      expect(parseNumericPrice(Infinity)).toBe(0);
    });
  });

  describe("formatPrice", () => {
    it("round-trips a value through parseNumericPrice + toLocaleString", () => {
      // Exact output depends on en-IN locale grouping, but parseNumericPrice
      // → toLocaleString should never throw for any input.
      expect(typeof formatPrice(1234.5)).toBe("string");
      expect(typeof formatPrice("invalid")).toBe("string");
      expect(formatPrice(0)).toBe("0");
    });
  });

  describe("formatPercent", () => {
    it("returns '--' for non-finite or non-numeric values", () => {
      expect(formatPercent(NaN)).toBe("--");
      expect(formatPercent(undefined)).toBe("--");
      expect(formatPercent("5")).toBe("--");
    });

    it("prefixes a '+' for positive values", () => {
      expect(formatPercent(5.4)).toBe("+5.40%");
    });

    it("does not prefix '+' for zero or negative values", () => {
      expect(formatPercent(0)).toBe("0.00%");
      expect(formatPercent(-3.2)).toBe("-3.20%");
    });
  });
});
