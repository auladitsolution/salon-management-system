// ==============================================================================
// ROLE-BASED ACCESS CONTROL (RBAC) & PERMISSION ENGINE
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

export type UserRole = "owner" | "manager" | "receptionist" | "staff" | "customer" | "guest";

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

  // Services & Categories
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

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
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
    PERMISSIONS.APPOINTMENTS_READ,
    PERMISSIONS.ATTENDANCE_RECORD,
    PERMISSIONS.COMMISSIONS_VIEW,
  ],
  customer: [],
  guest: [],
};

/**
 * Checks whether a role possesses a specific permission.
 */
export function hasPermission(role: UserRole | string | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const userRole = role as UserRole;
  if (userRole === "owner") return true; // Owner possesses all permissions
  const perms = ROLE_PERMISSIONS[userRole] || [];
  return perms.includes(permission);
}

/**
 * Checks whether a role possesses any of the required permissions.
 */
export function hasAnyPermission(role: UserRole | string | undefined | null, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
