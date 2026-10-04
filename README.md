# 💇‍♀️ Salon Booking & Management System (সেলুন বুকিং ও ম্যানেজমেন্ট সিস্টেম)
### Developed for Aulad IT Solution (Single-Tenant Commercial Master Codebase)

A complete, production-grade, secure, and fully Bengali-localized Salon Booking & Management System built for single-tenant commercial deployments across Bangladesh.

---

## 🌟 Key Architecture & Highlights

- **Single-Tenant Commercial Architecture:** One master source code deployed independently for each salon client. Client data is physically isolated with dedicated MongoDB Atlas databases, Firebase Authentication realms, Cloudinary buckets, and Vercel projects.
- **100% Bengali User Interface (Hind Siliguri Font):** All client-facing and administrative pages use Google Font **Hind Siliguri** and a centralized dictionary (`src/i18n/bn.ts`).
- **Zero Floating-Point Financial Precision:** Every price, subtotal, discount, tax, commission, and due balance is stored and calculated in **exact integer poisha (পয়সা)** (`1 BDT = 100 poisha`).
- **Atomic Concurrency Protection:** Unique compound database locks (`{ staffId: 1, bookingDate: 1, slotTime: 1 }`) eliminate double-booking even under concurrent traffic spikes.
- **Sequential Invoices & POS:** Concurrency-safe atomic counter increments generate professional sequential invoices (`INV-2026-00001`) with split payment recording (Cash, bKash, Nagad, Rocket, Bank, Card) and instant printable receipts.
- **Automated Inventory & Stock Movements:** Selling retail products in POS automatically decreases stock counts and writes an immutable audit movement ledger.
- **Role-Based Access Control (RBAC):** Server-side verification for Owner (মালিক), Manager (ম্যানেজার), Receptionist (রিসেপশনিস্ট), Staff (কর্মী), and Customer (গ্রাহক).

---

## 🚀 Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | React Server Components & Client Components |
| **Language** | TypeScript (Strict Mode) | Strong type-safety across all models, APIs, and business rules |
| **Styling** | Tailwind CSS | Custom premium salon color palette & responsive typography |
| **Typography** | Google Fonts (Hind Siliguri) | Global Bengali font configuration via `next/font/google` |
| **Database** | MongoDB Atlas & Mongoose | ACID multi-document transactions, compound unique indexes |
| **Authentication** | Firebase Auth & Firebase Admin SDK | Client sessions verified server-side with RBAC |
| **Media Storage** | Cloudinary SDK | Signed server-side image uploads for services, staff, receipts |
| **Testing** | Vitest | Automated unit and integration testing suite |

---

## 📂 Project Structure

```text
salon-booking-management-system/
├── docs/                             # Full architectural & operational documentation
│   ├── ARCHITECTURE.md               # High-level architecture guide
│   ├── DATABASE_SCHEMA.md            # Mongoose schemas & indexing strategy
│   ├── AUTHORIZATION.md              # RBAC matrix & permissions
│   ├── BOOKING_ENGINE.md             # Concurrency control & slot calculation
│   ├── FINANCIAL_RULES.md            # Exact poisha arithmetic specification
│   ├── ENVIRONMENT_SETUP.md          # Local configuration & credential rotation
│   ├── DEPLOYMENT.md                 # 15-step single-tenant deployment guide
│   ├── CLIENT_HANDOVER.md            # Client handover & operational training
│   ├── BACKUP_RESTORE.md             # Disaster recovery & database restoration
│   ├── SECURITY_CHECKLIST.md         # Application security hardening points
│   ├── TESTING.md                    # Vitest testing documentation
│   └── TROUBLESHOOTING.md            # Diagnostic resolutions
├── src/
│   ├── app/
│   │   ├── (public)/                 # Public website (Hero, Services, Team, Gallery, Contact)
│   │   ├── admin/                    # Admin Dashboard (KPIs, Calendar, POS, Staff, Inventory, Expenses, Reports)
│   │   ├── api/                      # 18 secure API route handlers
│   │   ├── book/                     # 5-step online appointment booking wizard
│   │   └── login/                    # Authentication & bootstrap portal
│   ├── components/
│   │   ├── layout/                   # Navbar & Footer
│   │   └── ui/                       # Reusable UI components (Button, Input, Badge, Card, Modal)
│   ├── features/
│   │   └── booking/                  # Availability engine & slot generator
│   ├── i18n/
│   │   └── bn.ts                     # Centralized Bengali localization dictionary
│   ├── lib/
│   │   ├── auth/                     # Server-side authentication guard
│   │   ├── db/                       # Mongoose connection pooling
│   │   ├── firebase/                 # Client and Admin SDK initializers
│   │   ├── money/                    # Exact integer poisha financial utilities
│   │   ├── dates/                    # Bengali date & Asia/Dhaka helpers
│   │   ├── permissions/              # RBAC permission matrix
│   │   └── validation/               # Bangladesh phone number normalizer
│   └── models/                       # 17 Mongoose schemas & models
├── tests/
│   └── unit/                         # Unit tests (Money, Phone, Permissions)
├── .env.example                      # Production environment template
├── tailwind.config.ts                # Tailwind design system configuration
└── vitest.config.ts                  # Vitest runner configuration
```

---

## ⚡ Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and add your client's credentials:
```bash
cp .env.example .env.local
```

### 3. Run Automated Tests
```bash
npm run test
```
All unit tests for poisha calculations, phone normalization, and RBAC matrix will execute.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the public website and booking wizard.

### 5. First-Time Administrator Bootstrap
When deploying for a new client, invoke the secure bootstrap endpoint once:
```bash
curl -X POST http://localhost:3000/api/admin/bootstrap \
  -H "Content-Type: application/json" \
  -d '{"secretKey": "aulad_it_secure_bootstrap_key_2026"}'
```
This initializes the owner account, business hours, and core Bengali service categories.

---

## 🛠 Production Build Verification

To create an optimized production bundle:
```bash
npm run build
```
Verify that all 36 static and dynamic routes compile successfully.

---

## 📄 License & Attribution

Developed as a commercial product by **Aulad IT Solution**, Dhaka, Bangladesh.
All rights reserved © 2026.
