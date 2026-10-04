# Automated Testing Strategy
**Salon Booking & Management System - Aulad IT Solution**

## 1. Testing Framework Overview
- **Vitest:** Blazing fast unit and integration tests for financial poisha arithmetic, booking algorithms, availability slot calculation, phone normalization, and state transitions.
- **Test Database Strategy:** Automated integration tests run with an isolated in-memory or dedicated test database URI.

---

## 2. Test Execution Commands

```bash
# Run all unit and integration tests
npm run test

# Run tests in watch mode during development
npm run test -- --watch

# Run specific test suite
npm run test tests/unit/money.test.ts
```

---

## 3. Coverage Areas

### 3.1. Unit Tests (`tests/unit/`)
1. **Financial Calculations (`money.test.ts`):**
   - Poisha conversion from BDT decimal.
   - Exact sum of line items.
   - Discount capping (discount cannot exceed subtotal).
   - Tax calculation rounding.
   - Due calculation with partial payments.
   - Bengali currency string formatting (`৳১,২৫০.০০`).
2. **Phone Number Normalization (`phone.test.ts`):**
   - Normalizing `01712345678` to `+8801712345678`.
   - Normalizing spaces and hyphens `017 12-345678`.
   - Rejection of invalid Bangladeshi prefixes.
3. **Booking State Machine (`bookingState.test.ts`):**
   - Valid transitions: `pending -> confirmed -> checked_in -> in_progress -> completed`.
   - Prevention of illegal transitions: `completed -> pending` (must throw error).
4. **Availability Engine (`availability.test.ts`):**
   - Correct filtering by opening hours.
   - Exclusion of weekly holidays and approved staff leaves.
   - Inclusion of service buffer times.

### 3.2. Integration & Concurrency Tests (`tests/integration/`)
1. **Double Booking Prevention:**
   - Simulating two concurrent booking calls for the exact same staff and slot; verifying that one succeeds and the other fails gracefully with duplicate key conflict.
2. **POS Checkout & Ledger Consistency:**
   - Verifying that successful sale decrements inventory, creates a stock movement record, and generates an immutable invoice with an atomic sequential number.
