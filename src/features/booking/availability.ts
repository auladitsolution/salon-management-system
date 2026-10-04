// ==============================================================================
// APPOINTMENT AVAILABILITY CALCULATION ENGINE
// Salon Booking & Management System - Aulad IT Solution
//
// Calculates free time intervals considering:
// 1. Salon opening hours & weekly holidays
// 2. Staff working days, shift hours & approved leaves
// 3. Service duration & buffer intervals
// 4. Existing appointments & active slot reservations
// ==============================================================================

import { connectToDatabase } from "@/lib/db/connect";
import { BusinessSettings } from "@/models/BusinessSettings";
import { Staff } from "@/models/Staff";
import { Service } from "@/models/Service";
import { Appointment } from "@/models/Appointment";
import { SlotReservation } from "@/models/SlotReservation";
import { StaffLeave } from "@/models/StaffLeave";
import { isSlotInPast } from "@/lib/dates/bengaliDate";
import { toAsciiNumerals } from "@/lib/money/poisha";

export interface AvailabilityQuery {
  date: string; // YYYY-MM-DD
  serviceIds: string[];
  staffId?: string; // Optional: specific stylist or any
}

export interface AvailableSlot {
  time: string; // "10:30"
  availableStaffIds: string[];
}

export interface AvailabilityResult {
  date: string;
  isOpen: boolean;
  message?: string;
  totalDurationMinutes: number;
  slots: AvailableSlot[];
  assignedStaff: Array<{ id: string; name: string; designation: string; avatarUrl?: string }>;
}

/**
 * Converts "HH:mm" to total minutes from midnight. Resilient to Bengali digits.
 */
function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const ascii = toAsciiNumerals(String(timeStr).trim());
  const parts = ascii.split(":");
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

/**
 * Converts total minutes from midnight to "HH:mm".
 */
function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export async function calculateAvailability(query: AvailabilityQuery): Promise<AvailabilityResult> {
  await connectToDatabase();

  const settings = await BusinessSettings.findOne();
  const openingTime = toAsciiNumerals(settings?.openingTime || "09:00");
  const closingTime = toAsciiNumerals(settings?.closingTime || "21:00");
  const weeklyHolidays = settings?.weeklyHolidays || [];
  const slotInterval = settings?.slotIntervalMinutes || 30;
  const cutoffHours = typeof settings?.bookingCutoffHours === "number" ? settings.bookingCutoffHours : 2;

  const normalizedDate = toAsciiNumerals(query.date);

  // 1. Check Salon Weekly Holiday
  const targetDate = new Date(`${normalizedDate}T00:00:00Z`);
  const dayOfWeek = targetDate.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  if (weeklyHolidays.includes(dayOfWeek)) {
    return {
      date: query.date,
      isOpen: false,
      message: "এই দিনে সেলুন সাপ্তাহিক বন্ধ থাকে।",
      totalDurationMinutes: 0,
      slots: [],
      assignedStaff: [],
    };
  }

  // 2. Fetch Selected Services
  const services = await Service.find({
    _id: { $in: query.serviceIds },
    isActive: true,
  });

  if (services.length === 0) {
    return {
      date: query.date,
      isOpen: false,
      message: "কোনো বৈধ সার্ভিস নির্বাচন করা হয়নি।",
      totalDurationMinutes: 0,
      slots: [],
      assignedStaff: [],
    };
  }

  // Calculate total duration + buffer
  const serviceDuration = services.reduce((acc, s) => acc + s.durationMinutes, 0);
  const maxBufferAfter = Math.max(...services.map((s) => s.bufferAfterMinutes || 0), 0);
  const totalDurationMinutes = serviceDuration + maxBufferAfter;

  // 3. Fetch Qualified Staff
  const staffQuery: Record<string, unknown> = { isActive: true };
  if (query.staffId && query.staffId !== "any") {
    staffQuery._id = query.staffId;
  }

  const allStaff = await Staff.find(staffQuery);
  // Filter staff who work on this day of week
  const eligibleStaff = allStaff.filter((s) => s.workingDays.includes(dayOfWeek));

  if (eligibleStaff.length === 0) {
    return {
      date: query.date,
      isOpen: false,
      message: "নির্বাচিত দিনে কোনো কর্মী কর্মশালায় উপস্থিত নেই।",
      totalDurationMinutes,
      slots: [],
      assignedStaff: [],
    };
  }

  const eligibleStaffIds = eligibleStaff.map((s) => s._id);

  // 4. Fetch Approved Leaves on this date
  const leaves = await StaffLeave.find({
    staffId: { $in: eligibleStaffIds },
    status: "approved",
    startDate: { $lte: query.date },
    endDate: { $gte: query.date },
  });
  const staffOnLeave = new Set(leaves.map((l) => l.staffId.toString()));

  // Active staff on this day
  const workingStaff = eligibleStaff.filter((s) => !staffOnLeave.has(s._id.toString()));

  if (workingStaff.length === 0) {
    return {
      date: query.date,
      isOpen: false,
      message: "সকল কর্মী ছুটিতে আছেন।",
      totalDurationMinutes,
      slots: [],
      assignedStaff: [],
    };
  }

  // 5. Fetch Existing Appointments & Active Slot Reservations for this date
  const existingAppointments = await Appointment.find({
    appointmentDate: normalizedDate,
    staffId: { $in: workingStaff.map((s) => s._id) },
    bookingStatus: { $nin: ["cancelled", "no_show"] },
  });

  const activeReservations = await SlotReservation.find({
    bookingDate: normalizedDate,
    staffId: { $in: workingStaff.map((s) => s._id) },
  });

  // 6. Generate Potential Slots
  const openMinutes = timeToMinutes(openingTime);
  const closeMinutes = timeToMinutes(closingTime);

  const availableSlots: AvailableSlot[] = [];

  for (let startM = openMinutes; startM + totalDurationMinutes <= closeMinutes; startM += slotInterval) {
    const slotTimeStr = minutesToTime(startM);

    // Skip past slots (accounting for cutoff hours)
    if (isSlotInPast(normalizedDate, slotTimeStr, cutoffHours * 60)) {
      continue;
    }

    const slotEndM = startM + totalDurationMinutes;
    const availableForThisSlot: string[] = [];

    for (const staff of workingStaff) {
      const staffShiftStart = timeToMinutes(staff.shiftStart || openingTime);
      const staffShiftEnd = timeToMinutes(staff.shiftEnd || closingTime);

      // Check shift bounds
      if (startM < staffShiftStart || slotEndM > staffShiftEnd) {
        continue;
      }

      const staffIdStr = staff._id.toString();

      // Check overlapping appointments
      const hasConflictAppt = existingAppointments.some((appt) => {
        if (appt.staffId.toString() !== staffIdStr) return false;
        const apptStart = timeToMinutes(appt.startTime);
        const apptEnd = timeToMinutes(appt.endTime);
        // Interval overlap condition: (StartA < EndB) and (EndA > StartB)
        return startM < apptEnd && slotEndM > apptStart;
      });

      if (hasConflictAppt) continue;

      // Check existing slot reservation locks
      const hasConflictLock = activeReservations.some((lock) => {
        if (lock.staffId.toString() !== staffIdStr) return false;
        const lockM = timeToMinutes(lock.slotTime);
        return lockM >= startM && lockM < slotEndM;
      });

      if (hasConflictLock) continue;

      availableForThisSlot.push(staffIdStr);
    }

    if (availableForThisSlot.length > 0) {
      availableSlots.push({
        time: slotTimeStr,
        availableStaffIds: availableForThisSlot,
      });
    }
  }

  return {
    date: query.date,
    isOpen: true,
    totalDurationMinutes,
    slots: availableSlots,
    assignedStaff: workingStaff.map((s) => ({
      id: s._id.toString(),
      name: s.fullName,
      designation: s.designation,
      avatarUrl: s.avatarUrl,
    })),
  };
}
