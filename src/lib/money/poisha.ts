// ==============================================================================
// EXACT POISHA FINANCIAL ARITHMETIC UTILITIES
// Salon Booking & Management System - Aulad IT Solution
//
// Rules:
// 1. All monetary values stored and processed as integer poisha (1 BDT = 100 poisha).
// 2. Absolutely NO floating-point arithmetic for financial ledgers or invoices.
// ==============================================================================

/**
 * Converts a BDT amount (number or string) into exact integer poisha.
 * Example: 750.50 -> 75050 poisha
 */
export function toPoisha(bdtAmount: number | string | null | undefined): number {
  if (bdtAmount === null || bdtAmount === undefined || bdtAmount === "") {
    return 0;
  }
  const parsed = typeof bdtAmount === "string" ? parseFloat(bdtAmount) : bdtAmount;
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

/**
 * Converts poisha back to BDT decimal string for form inputs.
 * Example: 75050 -> "750.50"
 */
export function toBdtDecimal(poishaAmount: number): string {
  if (isNaN(poishaAmount)) return "0.00";
  return (poishaAmount / 100).toFixed(2);
}

/**
 * Converts English digits to Bengali digits.
 */
export function toBengaliNumerals(val: string | number): string {
  const str = String(val);
  const bengaliDigits: Record<string, string> = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
  };
  return str.replace(/\d/g, (d) => bengaliDigits[d] || d);
}

/**
 * Converts Bengali digits to English (ASCII) digits.
 */
export function toAsciiNumerals(val: string | number): string {
  const str = String(val);
  const bengaliToAscii: Record<string, string> = {
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
    "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
  };
  return str.replace(/[০-৯]/g, (d) => bengaliToAscii[d] || d);
}

/**
 * Formats poisha into a rich Bengali currency string: ৳ ১,২৫০.০০
 */
export function formatBengaliCurrency(poishaAmount: number, showSymbol = true): string {
  if (isNaN(poishaAmount)) return showSymbol ? "৳ ০.০০" : "০.০০";

  const isNegative = poishaAmount < 0;
  const absPoisha = Math.abs(poishaAmount);
  const bdtDecimal = (absPoisha / 100).toFixed(2);
  const [intPart, decimalPart] = bdtDecimal.split(".");

  // Format with thousand separators: 123456 -> 123,456
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const bnInt = toBengaliNumerals(formattedInt);
  const bnDecimal = toBengaliNumerals(decimalPart);

  const result = `${isNegative ? "-" : ""}${bnInt}.${bnDecimal}`;
  return showSymbol ? `৳ ${result}` : result;
}

/**
 * Calculates line-item total in poisha.
 */
export function calculateLineTotal(unitPriceMinor: number, quantity: number): number {
  const safeQty = Math.max(0, Math.floor(quantity));
  return Math.round(unitPriceMinor * safeQty);
}

export interface PosCalculationInput {
  subtotalMinor: number;
  discountMinor: number;
  taxPercent: number; // e.g. 5 for 5% VAT
  paidAmountMinor: number;
}

export interface PosCalculationResult {
  subtotalMinor: number;
  discountMinor: number;
  taxableBaseMinor: number;
  taxMinor: number;
  totalAmountMinor: number;
  paidAmountMinor: number;
  dueAmountMinor: number;
}

/**
 * Server-side verified calculation of POS invoice figures.
 */
export function calculatePosTotals(input: PosCalculationInput): PosCalculationResult {
  const subtotal = Math.max(0, Math.round(input.subtotalMinor));
  // Discount cannot exceed subtotal
  const discount = Math.min(subtotal, Math.max(0, Math.round(input.discountMinor)));
  const taxableBase = subtotal - discount;

  // Tax calculation rounded to nearest poisha
  const safeTaxRate = Math.max(0, Number(input.taxPercent) || 0);
  const taxMinor = Math.round((taxableBase * safeTaxRate) / 100);

  const totalAmountMinor = taxableBase + taxMinor;
  const paidAmountMinor = Math.max(0, Math.round(input.paidAmountMinor));
  const dueAmountMinor = Math.max(0, totalAmountMinor - paidAmountMinor);

  return {
    subtotalMinor: subtotal,
    discountMinor: discount,
    taxableBaseMinor: taxableBase,
    taxMinor,
    totalAmountMinor,
    paidAmountMinor,
    dueAmountMinor,
  };
}
