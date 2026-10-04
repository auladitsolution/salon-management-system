# Financial Transaction Rules & Poisha Arithmetic
**Salon Booking & Management System - Aulad IT Solution**

## 1. Golden Rules of Financial Calculations
1. **Never use IEEE 754 Floating-Point Numbers for Money:**
   - In JavaScript, `0.1 + 0.2 === 0.30000000000000004`. Using floats leads to penny/poisha discrepancies in ledgers and audits.
   - All financial amounts are stored as **integer poisha** (Minor Units).
   - `1 BDT (টাকা) = 100 Poisha (পয়সা)`.
   - Examples:
     - ৳ 150 = `15000` poisha
     - ৳ 1,250.50 = `125050` poisha
2. **Server-Side Validation:**
   - Frontend totals, discounts, and taxes are treated as purely informational.
   - The server recalculates and validates every subtotal, discount cap, tax percentage, and due balance before saving.
3. **Immutable Invoices:**
   - Completed invoices cannot be updated or deleted.
   - Adjustments must be made via explicit credit notes, refunds, or voiding with an audit log.

---

## 2. Arithmetic Helpers Specification (`src/lib/money/poisha.ts`)

```typescript
// Converts BDT float/decimal input from forms to integer poisha
export function toPoisha(bdtAmount: number | string): number {
  const parsed = typeof bdtAmount === "string" ? parseFloat(bdtAmount) : bdtAmount;
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
}

// Formats poisha into Bengali currency string (e.g. ৳১,৫০০.০০)
export function formatBengaliCurrency(poishaAmount: number): string {
  const bdt = (poishaAmount / 100).toFixed(2);
  const parts = bdt.split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const bengaliNumerals: Record<string, string> = {
    "0": "০", "1": "১", "2": "২", "3": "৩", "4": "৪",
    "5": "৫", "6": "৬", "7": "৭", "8": "৮", "9": "৯",
    ",": ",", ".": "."
  };
  const bnFormatted = (intPart + "." + parts[1])
    .split("")
    .map((c) => bengaliNumerals[c] || c)
    .join("");
  return `৳ ${bnFormatted}`;
}
```

---

## 3. POS Calculation Equations
1. **Line Item Total:**
   $$\text{itemTotalMinor} = \text{unitPriceMinor} \times \text{quantity}$$
2. **Subtotal:**
   $$\text{subtotalMinor} = \sum \text{itemTotalMinor}$$
3. **Discount:**
   $$\text{discountMinor} = \min(\text{requestedDiscountMinor}, \text{subtotalMinor})$$
4. **Taxable Base:**
   $$\text{taxableBaseMinor} = \text{subtotalMinor} - \text{discountMinor}$$
5. **Tax Amount:**
   $$\text{taxMinor} = \text{Math.round}\left(\frac{\text{taxableBaseMinor} \times \text{taxPercent}}{100}\right)$$
6. **Total Amount:**
   $$\text{totalAmountMinor} = \text{taxableBaseMinor} + \text{taxMinor}$$
7. **Due Balance:**
   $$\text{dueAmountMinor} = \max(0, \text{totalAmountMinor} - \text{paidAmountMinor})$$

---

## 4. Payment Methods & Verification
- **Supported Methods:** Cash (নগদ), bKash (বিকাশ), Nagad (নগদ ওয়ালেট), Rocket (রকেট), Bank Transfer (ব্যাংক ট্রান্সফার), Card (কার্ড).
- **Manual Verification:**
  - For MFS (bKash/Nagad/Rocket) transactions, staff records the manual transaction reference/TRX ID.
  - The record is stamped with `isManualVerified: true` and the verifying staff's user ID.
  - No fake automated gateway responses are generated.
