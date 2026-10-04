import { describe, it, expect } from "vitest";
import { hasPermission, PERMISSIONS } from "@/lib/permissions/matrix";

describe("Role-Based Access Control (RBAC)", () => {
  it("allows owner full permissions across all operations", () => {
    expect(hasPermission("owner", PERMISSIONS.APPOINTMENTS_READ)).toBe(true);
    expect(hasPermission("owner", PERMISSIONS.POS_CREATE)).toBe(true);
    expect(hasPermission("owner", PERMISSIONS.SETTINGS_MANAGE)).toBe(true);
    expect(hasPermission("owner", PERMISSIONS.USERS_MANAGE)).toBe(true);
    expect(hasPermission("owner", PERMISSIONS.EXPENSES_MANAGE)).toBe(true);
  });

  it("restricts receptionist from modifying business settings or managing users", () => {
    expect(hasPermission("receptionist", PERMISSIONS.APPOINTMENTS_READ)).toBe(true);
    expect(hasPermission("receptionist", PERMISSIONS.POS_CREATE)).toBe(true);
    expect(hasPermission("receptionist", PERMISSIONS.SETTINGS_MANAGE)).toBe(false);
    expect(hasPermission("receptionist", PERMISSIONS.USERS_MANAGE)).toBe(false);
    expect(hasPermission("receptionist", PERMISSIONS.EXPENSES_MANAGE)).toBe(false);
  });

  it("restricts staff from financial, POS or settings actions", () => {
    expect(hasPermission("staff", PERMISSIONS.APPOINTMENTS_READ)).toBe(true);
    expect(hasPermission("staff", PERMISSIONS.ATTENDANCE_RECORD)).toBe(true);
    expect(hasPermission("staff", PERMISSIONS.POS_CREATE)).toBe(false);
    expect(hasPermission("staff", PERMISSIONS.SERVICES_MANAGE)).toBe(false);
  });

  it("blocks customer and guest from administrative permissions", () => {
    expect(hasPermission("customer", PERMISSIONS.APPOINTMENTS_READ)).toBe(false);
    expect(hasPermission("customer", PERMISSIONS.POS_CREATE)).toBe(false);
    expect(hasPermission("guest", PERMISSIONS.APPOINTMENTS_READ)).toBe(false);
  });
});
