# Database Schema & Mongoose Architecture
**Salon Booking & Management System - Aulad IT Solution**

## 1. Database Philosophy & Principles
- **MongoDB Atlas with Mongoose:** All models enforce strict schema validation, type definitions, timestamps, and indexes.
- **Integer Poisha Monetary Storage:** All financial fields (prices, subtotals, taxes, discounts, commissions, dues) are stored as integers in poisha (`1 BDT = 100 poisha`). Example: ৳ 750.00 is stored as `75000`.
- **Soft Deletion & Historical Snapshots:** When an appointment or invoice is created, snapshots of service name, duration, price, and staff member are recorded. Changes to future service prices never alter historical sales.
- **Atomic Concurrency Protection:** Unique compound indexes prevent double-booking.

---

## 2. Core Collections & Schemas

### 2.1. `users`
Authenticated users linked to Firebase Auth UID.
- `firebaseUid` (string, unique, index)
- `email` (string, indexed, lowercase)
- `phone` (string, indexed, normalized E.164 / BD format)
- `fullName` (string)
- `role` (`"owner" | "manager" | "receptionist" | "staff" | "customer"`)
- `status` (`"active" | "inactive" | "suspended"`)
- `staffProfileId` (ObjectId, optional, ref: 'Staff')
- `customerProfileId` (ObjectId, optional, ref: 'Customer')
- `avatarUrl` (string, optional)
- `createdAt`, `updatedAt` (Date)

### 2.2. `customers`
Customer relationship records (CRM).
- `name` (string)
- `phone` (string, unique, indexed)
- `email` (string, optional)
- `gender` (`"male" | "female" | "other"`, optional)
- `dateOfBirth` (Date, optional)
- `notes` (string, private internal notes)
- `totalSpendMinor` (number, default: 0)
- `totalVisits` (number, default: 0)
- `lastVisitDate` (Date, optional)
- `preferredStaffId` (ObjectId, ref: 'Staff', optional)
- `createdAt`, `updatedAt` (Date)

### 2.3. `staff`
Staff profiles for stylists, barbers, estheticians, and receptionists.
- `fullName` (string)
- `phone` (string, unique, indexed)
- `email` (string, optional)
- `designation` (string)
- `specialization` (string[])
- `assignedServiceIds` (ObjectId[], ref: 'Service')
- `workingDays` (number[] - 0 for Sun, 1 for Mon, etc.)
- `shiftStart` (string - "09:00")
- `shiftEnd` (string - "20:00")
- `commissionType` (`"none" | "fixed_minor" | "percentage"`)
- `commissionValue` (number)
- `avatarUrl` (string, optional)
- `isActive` (boolean, default: true)
- `createdAt`, `updatedAt` (Date)

### 2.4. `serviceCategories`
Service taxonomy categories (e.g., হেয়ার কাট, ফেসিয়াল, স্পা).
- `name` (string, unique)
- `slug` (string, unique, indexed)
- `description` (string, optional)
- `orderIndex` (number, default: 0)
- `isActive` (boolean, default: true)
- `createdAt`, `updatedAt` (Date)

### 2.5. `services`
Catalog of salon services.
- `name` (string)
- `slug` (string, unique, indexed)
- `categoryId` (ObjectId, ref: 'ServiceCategory', index)
- `description` (string)
- `priceMinor` (number - integer in poisha, e.g. 50000 = ৳500)
- `durationMinutes` (number - e.g., 30, 45, 60)
- `bufferBeforeMinutes` (number, default: 0)
- `bufferAfterMinutes` (number, default: 5)
- `imageUrl` (string, optional)
- `assignedStaffIds` (ObjectId[], ref: 'Staff')
- `isActive` (boolean, default: true)
- `isFeatured` (boolean, default: false)
- `onlineBookingEnabled` (boolean, default: true)
- `createdAt`, `updatedAt` (Date)

### 2.6. `appointments`
Customer appointments with status history and service snapshots.
- `bookingReference` (string, unique, indexed - e.g. `SB-2026-ABC12`)
- `customerId` (ObjectId, ref: 'Customer', optional for guest)
- `customerName` (string)
- `customerPhone` (string, indexed)
- `customerEmail` (string, optional)
- `guestVerificationCode` (string, hashed/secure)
- `staffId` (ObjectId, ref: 'Staff', indexed)
- `appointmentDate` (string, indexed - `YYYY-MM-DD`)
- `startTime` (string - `HH:mm`)
- `endTime` (string - `HH:mm`)
- `totalDurationMinutes` (number)
- `services` (Array of snapshots: `{ serviceId, name, priceMinor, durationMinutes }`)
- `subtotalMinor` (number)
- `discountMinor` (number, default: 0)
- `totalMinor` (number)
- `bookingStatus` (`"pending" | "confirmed" | "checked_in" | "in_progress" | "completed" | "cancelled" | "no_show"`, indexed)
- `paymentStatus` (`"unpaid" | "partially_paid" | "paid" | "refunded"`)
- `customerNotes` (string, optional)
- `internalNotes` (string, optional)
- `invoiceId` (ObjectId, ref: 'Invoice', optional)
- `createdAt`, `updatedAt` (Date)

### 2.7. `slotReservations` (Concurrency Engine)
Atomic reservation locks preventing overlapping bookings.
- `staffId` (ObjectId, ref: 'Staff', index)
- `bookingDate` (string, index - `YYYY-MM-DD`)
- `slotTime` (string - `HH:mm`)
- `appointmentId` (ObjectId, ref: 'Appointment')
- `expiresAt` (Date, TTL index for pending guest reservations)
**Compound Unique Index:** `{ staffId: 1, bookingDate: 1, slotTime: 1 }` -> Guarantees zero double bookings.

### 2.8. `products` & `stockMovements`
Inventory items and movement audit ledger.
- `name` (string)
- `sku` (string, unique, indexed)
- `category` (string)
- `costPriceMinor` (number)
- `sellingPriceMinor` (number)
- `currentStock` (number, default: 0)
- `reorderLevel` (number, default: 5)
- `unit` (string - e.g. "পিস", "বোতল", "মি.লি.")
- `isActive` (boolean, default: true)

`stockMovements`:
- `productId` (ObjectId, ref: 'Product', index)
- `type` (`"in" | "out" | "adjustment" | "sale" | "return"`)
- `quantity` (number)
- `previousStock` (number)
- `newStock` (number)
- `reason` (string)
- `referenceId` (string, optional)
- `createdBy` (ObjectId, ref: 'User')
- `createdAt` (Date)

### 2.9. `invoices` & `payments`
Financial billing documents and ledger.
- `invoiceNumber` (string, unique, indexed - e.g. `INV-2026-0001`)
- `appointmentId` (ObjectId, ref: 'Appointment', optional)
- `customerId` (ObjectId, ref: 'Customer', optional)
- `customerName` (string)
- `customerPhone` (string)
- `items` (Array of `{ type: "service" | "product", name, quantity, unitPriceMinor, totalMinor }`)
- `subtotalMinor` (number)
- `discountMinor` (number)
- `taxMinor` (number)
- `totalAmountMinor` (number)
- `paidAmountMinor` (number)
- `dueAmountMinor` (number)
- `paymentStatus` (`"unpaid" | "partially_paid" | "paid" | "refunded" | "voided"`)
- `payments` (Array of `{ method, amountMinor, transactionRef, isManualVerified, paidAt }`)
- `createdAt`, `updatedAt` (Date)

### 2.10. `expenses`
Operational expenses ledger.
- `title` (string)
- `category` (`"rent" | "utility" | "salary" | "inventory" | "maintenance" | "marketing" | "other"`)
- `amountMinor` (number)
- `expenseDate` (Date)
- `paymentMethod` (string)
- `description` (string, optional)
- `receiptUrl` (string, optional)
- `createdBy` (ObjectId, ref: 'User')
- `createdAt` (Date)

### 2.11. `commissions`
Staff commission records.
- `staffId` (ObjectId, ref: 'Staff', index)
- `appointmentId` (ObjectId, ref: 'Appointment', optional)
- `invoiceId` (ObjectId, ref: 'Invoice', optional)
- `serviceName` (string)
- `serviceAmountMinor` (number)
- `commissionAmountMinor` (number)
- `status` (`"pending" | "approved" | "paid" | "cancelled"`)
- `paidAt` (Date, optional)
- `createdAt` (Date)

### 2.12. `businessSettings`
Salon identity, branding, policies, and feature flags.
- `salonName` (string)
- `tagline` (string)
- `phone` (string)
- `email` (string)
- `address` (string)
- `openingTime` (string - "09:00")
- `closingTime` (string - "21:00")
- `weeklyHolidays` (number[])
- `slotIntervalMinutes` (number - 15 or 30)
- `bookingCutoffHours` (number - e.g. 2)
- `maxAdvanceDays` (number - e.g. 30)
- `currency` (string, "BDT")
- `currencySymbol` (string, "৳")
- `features` (object containing feature toggles)
- `heroTitle`, `heroSubtitle`, `heroImageUrl` (string)
- `socialLinks` (Facebook, Instagram, WhatsApp)
