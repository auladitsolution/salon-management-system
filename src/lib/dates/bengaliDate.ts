// ==============================================================================
// BENGALI DATE & TIME UTILITIES (ঢাকা টাইমজোন ও বাংলা ফরম্যাটিং)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { toBengaliNumerals, toAsciiNumerals } from "../money/poisha";

export const BENGALI_MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
];

export const BENGALI_DAYS = [
  "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
];

export const BENGALI_DAYS_SHORT = [
  "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"
];

/**
 * Returns current timestamp formatted as YYYY-MM-DD in Asia/Dhaka.
 */
export function getDhakaTodayString(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", options).format(now);
}

/**
 * Returns tomorrow timestamp formatted as YYYY-MM-DD in Asia/Dhaka.
 */
export function getDhakaTomorrowString(): string {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Intl.DateTimeFormat("en-CA", options).format(tomorrow);
}

/**
 * Formats a Date object or ISO string into a rich Bengali date string.
 * Example: 2026-10-04 -> "৪ অক্টোবর, ২০২৬"
 */
export function formatBengaliDate(dateInput: Date | string): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(d.getTime())) return "";

  const day = d.getDate();
  const month = BENGALI_MONTHS[d.getMonth()];
  const year = d.getFullYear();

  return `${toBengaliNumerals(day)} ${month}, ${toBengaliNumerals(year)}`;
}

/**
 * Formats time string (e.g. "14:30") or Date into Bengali 12-hour format with AM/PM.
 * Example: "14:30" -> "০২:৩০ অপরাহ্ন"
 */
export function formatBengaliTime(timeStr: string): string {
  if (!timeStr || !timeStr.includes(":")) return timeStr;
  const asciiTime = toAsciiNumerals(timeStr);
  const [hStr, mStr] = asciiTime.split(":");
  let hours = parseInt(hStr, 10);
  const minutes = parseInt(mStr, 10);
  if (isNaN(hours) || isNaN(minutes)) return timeStr;

  const isPm = hours >= 12;
  const period = isPm ? "অপরাহ্ন" : "পূর্বাহ্ন";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return `${toBengaliNumerals(formattedHours)}:${toBengaliNumerals(formattedMinutes)} ${period}`;
}

/**
 * Combines date string and time string to check if slot is in the past.
 */
export function isSlotInPast(dateStr: string, timeStr: string, bufferMinutes = 0): boolean {
  if (!dateStr || !timeStr) return false;
  const asciiDate = toAsciiNumerals(dateStr);
  const asciiTime = toAsciiNumerals(timeStr);
  const [year, month, day] = asciiDate.split("-").map(Number);
  const [hour, minute] = asciiTime.split(":").map(Number);

  if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hour) || isNaN(minute)) {
    return false;
  }

  // Parse in local or UTC relative to Dhaka (UTC+6)
  const slotDate = new Date(Date.UTC(year, month - 1, day, hour - 6, minute));
  const now = new Date();
  const threshold = new Date(now.getTime() + bufferMinutes * 60 * 1000);

  return slotDate.getTime() <= threshold.getTime();
}
