import { describe, it, expect } from "vitest";
import {
  toPoisha,
  toBdtDecimal,
  calculateLineTotal,
  calculatePosTotals,
  formatBengaliCurrency,
  toBengaliNumerals,
  toAsciiNumerals,
} from "@/lib/money/poisha";

describe("Exact Poisha Financial Arithmetic", () => {
  it("converts BDT decimal to integer poisha accurately without floating-point errors", () => {
    expect(toPoisha(100)).toBe(10000);
    expect(toPoisha("150.50")).toBe(15050);
    expect(toPoisha(0.1 + 0.2)).toBe(30); // 0.30 BDT is exactly 30 poisha
    expect(toPoisha(0)).toBe(0);
    expect(toPoisha(null)).toBe(0);
  });

  it("converts poisha back to BDT decimal string", () => {
    expect(toBdtDecimal(15050)).toBe("150.50");
    expect(toBdtDecimal(10000)).toBe("100.00");
    expect(toBdtDecimal(0)).toBe("0.00");
  });

  it("calculates line-item totals in poisha", () => {
    // 500 BDT = 50000 poisha, quantity 3 = 150000 poisha
    expect(calculateLineTotal(50000, 3)).toBe(150000);
    expect(calculateLineTotal(50000, 0)).toBe(0);
  });

  it("verifies POS totals with discount capping and tax rounding", () => {
    const result = calculatePosTotals({
      subtotalMinor: 100000, // ৳ 1,000.00
      discountMinor: 20000,  // ৳ 200.00
      taxPercent: 5,         // 5% VAT on (1000 - 200) = ৳ 40.00 (4000 poisha)
      paidAmountMinor: 50000,// ৳ 500.00 paid
    });

    expect(result.subtotalMinor).toBe(100000);
    expect(result.discountMinor).toBe(20000);
    expect(result.taxableBaseMinor).toBe(80000);
    expect(result.taxMinor).toBe(4000);
    expect(result.totalAmountMinor).toBe(84000); // ৳ 840.00
    expect(result.paidAmountMinor).toBe(50000);
    expect(result.dueAmountMinor).toBe(34000);   // ৳ 340.00 due
  });

  it("prevents discount from exceeding subtotal", () => {
    const result = calculatePosTotals({
      subtotalMinor: 50000,
      discountMinor: 80000, // requested discount > subtotal
      taxPercent: 0,
      paidAmountMinor: 0,
    });

    expect(result.discountMinor).toBe(50000); // capped at subtotal
    expect(result.taxableBaseMinor).toBe(0);
    expect(result.totalAmountMinor).toBe(0);
    expect(result.dueAmountMinor).toBe(0);
  });

  it("formats poisha into Bengali currency string", () => {
    expect(formatBengaliCurrency(125000)).toBe("৳ ১,২৫০.০০");
    expect(formatBengaliCurrency(0)).toBe("৳ ০.০০");
  });

  it("converts between Bengali numerals and ASCII numerals bidirectionally", () => {
    expect(toBengaliNumerals("09:00")).toBe("০৯:০০");
    expect(toAsciiNumerals("০৯:০০")).toBe("09:00");
    expect(toAsciiNumerals("২১:৩০")).toBe("21:30");
    expect(toAsciiNumerals("১২৩৪৫৬৭৮৯০")).toBe("1234567890");
  });
});
