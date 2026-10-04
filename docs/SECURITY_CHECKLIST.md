# Security Checklist & Hardening Guide
**Salon Booking & Management System - Aulad IT Solution**

## 1. Security Architecture Summary
This system follows defense-in-depth principles across transport, authentication, authorization, database concurrency, and business logic.

---

## 2. Hardening Verification Checklist

### 2.1. Authentication & Session Management
- [x] Firebase ID tokens verified server-side with Firebase Admin SDK.
- [x] Revoked tokens and deleted Firebase users immediately rejected by server-side verification.
- [x] Client credentials (API Keys, App ID) restricted strictly to `NEXT_PUBLIC_` prefixes.
- [x] Server credentials (Firebase Private Key, Cloudinary Secret, MongoDB URI) strictly blocked from client bundles.
- [x] First-time administrator bootstrap protected by high-entropy secret token and idempotent database check.

### 2.2. Authorization & RBAC
- [x] All admin routes (`/admin/*`) and mutation APIs guarded with server-side RBAC checks.
- [x] Users cannot self-elevate permissions via client request manipulation.
- [x] Customers restricted to viewing only their own appointments, invoices, and profile.
- [x] Staff restricted to their assigned schedule and permitted personal records.
- [x] Private internal customer notes hidden from unauthorized staff and customer portal.

### 2.3. Data Validation & Concurrency
- [x] Zod validation enforced on all external input (dates, times, phone numbers, poisha prices).
- [x] Bangladesh phone numbers strictly validated and normalized (`01XXXXXXXXX` or `+8801XXXXXXXXX`).
- [x] Concurrency protection via atomic compound unique index on `slotReservations` (`staffId`, `bookingDate`, `slotTime`).
- [x] Idempotency keys used for booking and POS submissions to prevent duplicate transactions.

### 2.4. Financial & Inventory Integrity
- [x] Zero floating-point arithmetic: All monetary values handled as integer poisha.
- [x] Frontend totals treated as untrusted; server recomputes subtotals, discounts, taxes, and dues.
- [x] Sequential invoice numbers generated via atomic counter collection.
- [x] Invoices immutable after finalization; refunds recorded with dedicated audit trails.
- [x] Stock movement ledger records every deduction, addition, and adjustment.

### 2.5. Data Export & CSV Injection Prevention
- [x] All CSV export values sanitized against formula injection (prepended single-quote if starting with `=`, `+`, `-`, or `@`).
- [x] Rate limiting applied to public booking and authentication endpoints.
