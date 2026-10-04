# Role-Based Access Control (RBAC) & Authorization
**Salon Booking & Management System - Aulad IT Solution**

## 1. Principles of Security & Authorization
- **Server-Side Enforcement:** Permissions are never validated purely on client-side state. Every API Route Handler and Server Action validates the caller's verified Firebase session against the internal MongoDB user role.
- **Principle of Least Privilege:** Users only have permissions required to fulfill their specific functions.
- **Tamper-Proof Roles:** Roles are stored in MongoDB and verified server-side. Firebase custom claims or client tokens cannot self-elevate to administrative privileges.
- **Audited Administrative Actions:** Sensitive actions (deleting records, voiding invoices, changing settings, modifying attendance) are recorded with an audit trail.

---

## 2. Role Hierarchy

| Role | Bengali Description | Access Scope |
|---|---|---|
| `owner` | মালিক / প্রধান অ্যাডমিন | Full unlimited business, financial, settings, and staff control |
| `manager` | ম্যানেজার | Operations, calendar, POS, appointments, staff scheduling, inventory |
| `receptionist` | রিসেপশনিস্ট | Appointments, walk-ins, calendar, customer CRM, POS billing |
| `staff` | কর্মী / স্টাইলিস্ট | Assigned appointments, personal daily schedule, attendance, commissions |
| `customer` | নিবন্ধিত গ্রাহক | Own appointments, own profile, own invoices, reviews |
| `guest` | অতিথি গ্রাহক | Public booking wizard, appointment reference lookup with verification |

---

## 3. Fine-Grained Permissions Matrix

```typescript
export const PERMISSIONS = {
  // Appointments
  APPOINTMENTS_READ: "appointments.read",
  APPOINTMENTS_CREATE: "appointments.create",
  APPOINTMENTS_UPDATE: "appointments.update",
  APPOINTMENTS_CANCEL: "appointments.cancel",
  APPOINTMENTS_STATUS: "appointments.status",

  // Customers (CRM)
  CUSTOMERS_READ: "customers.read",
  CUSTOMERS_CREATE: "customers.create",
  CUSTOMERS_UPDATE: "customers.update",
  CUSTOMERS_DELETE: "customers.delete",

  // Staff & Attendance
  STAFF_MANAGE: "staff.manage",
  STAFF_SCHEDULE: "staff.schedule",
  ATTENDANCE_RECORD: "attendance.record",
  ATTENDANCE_MANAGE: "attendance.manage",
  COMMISSIONS_VIEW: "commissions.view",
  COMMISSIONS_APPROVE: "commissions.approve",

  // Services
  SERVICES_MANAGE: "services.manage",

  // Point of Sale & Billing
  POS_CREATE: "pos.create",
  INVOICE_VIEW: "invoices.view",
  INVOICE_VOID: "invoices.void",
  PAYMENT_MANAGE: "payments.manage",
  REFUND_MANAGE: "refunds.manage",

  // Inventory & Expenses
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_MANAGE: "inventory.manage",
  EXPENSES_VIEW: "expenses.view",
  EXPENSES_MANAGE: "expenses.manage",

  // Reports & Analytics
  REPORTS_READ: "reports.read",

  // Settings & System
  SETTINGS_MANAGE: "settings.manage",
  USERS_MANAGE: "users.manage",
  AUDIT_READ: "audit.read",
} as const;
```

---

## 4. Role-to-Permission Mapping

```typescript
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: Object.values(PERMISSIONS),
  manager: [
    PERMISSIONS.APPOINTMENTS_READ,
    PERMISSIONS.APPOINTMENTS_CREATE,
    PERMISSIONS.APPOINTMENTS_UPDATE,
    PERMISSIONS.APPOINTMENTS_CANCEL,
    PERMISSIONS.APPOINTMENTS_STATUS,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_UPDATE,
    PERMISSIONS.STAFF_MANAGE,
    PERMISSIONS.STAFF_SCHEDULE,
    PERMISSIONS.ATTENDANCE_RECORD,
    PERMISSIONS.ATTENDANCE_MANAGE,
    PERMISSIONS.COMMISSIONS_VIEW,
    PERMISSIONS.SERVICES_MANAGE,
    PERMISSIONS.POS_CREATE,
    PERMISSIONS.INVOICE_VIEW,
    PERMISSIONS.PAYMENT_MANAGE,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.EXPENSES_VIEW,
    PERMISSIONS.EXPENSES_MANAGE,
    PERMISSIONS.REPORTS_READ,
  ],
  receptionist: [
    PERMISSIONS.APPOINTMENTS_READ,
    PERMISSIONS.APPOINTMENTS_CREATE,
    PERMISSIONS.APPOINTMENTS_UPDATE,
    PERMISSIONS.APPOINTMENTS_CANCEL,
    PERMISSIONS.APPOINTMENTS_STATUS,
    PERMISSIONS.CUSTOMERS_READ,
    PERMISSIONS.CUSTOMERS_CREATE,
    PERMISSIONS.CUSTOMERS_UPDATE,
    PERMISSIONS.POS_CREATE,
    PERMISSIONS.INVOICE_VIEW,
    PERMISSIONS.PAYMENT_MANAGE,
    PERMISSIONS.INVENTORY_VIEW,
  ],
  staff: [
    PERMISSIONS.APPOINTMENTS_READ, // filtered to assigned only
    PERMISSIONS.ATTENDANCE_RECORD,
    PERMISSIONS.COMMISSIONS_VIEW, // filtered to own commissions
  ],
  customer: [
    // Scoped to own resources only
  ],
  guest: [],
};
```

---

## 5. First-Time Secure Administrator Bootstrap
The application includes an idempotent bootstrap endpoint:
`POST /api/admin/bootstrap`

### Bootstrap Flow:
1. Verifies that `BOOTSTRAP_SECRET_KEY` matches environment variable.
2. Checks if an `owner` user already exists in the MongoDB database.
3. If no owner exists:
   - Registers/verifies the administrator account with the email specified in `BOOTSTRAP_ADMIN_EMAIL`.
   - Creates the initial `User` document with role `owner` and status `active`.
   - Populates initial `businessSettings` and default service categories.
4. If an owner already exists:
   - Immediately rejects the request with HTTP 403 Forbidden to prevent account takeover.
