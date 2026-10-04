// ==============================================================================
// BANGLADESH PHONE NUMBER NORMALIZATION & VALIDATOR
// Salon Booking & Management System - Aulad IT Solution
//
// Formats supported:
// - 017XXXXXXXX
// - +88017XXXXXXXX
// - 88017XXXXXXXX
// - 017XX-XXXXXX (with dashes or spaces)
// ==============================================================================

/**
 * Valid Bangladesh mobile operator prefixes:
 * 013, 014, 015, 016, 017, 018, 019
 */
const BD_MOBILE_REGEX = /^(?:\+?880|0)?(1[3-9]\d{8})$/;

export interface PhoneValidationResult {
  isValid: boolean;
  normalizedLocal: string; // e.g. "01712345678"
  normalizedE164: string;  // e.g. "+8801712345678"
  operator: string;
}

const OPERATOR_NAMES: Record<string, string> = {
  "13": "Grameenphone",
  "14": "Banglalink",
  "15": "Teletalk",
  "16": "Airtel",
  "17": "Grameenphone",
  "18": "Robi",
  "19": "Banglalink",
};

/**
 * Validates and normalizes any Bangladeshi phone input into consistent standard formats.
 */
export function normalizeBdPhone(input: string | null | undefined): PhoneValidationResult {
  if (!input) {
    return { isValid: false, normalizedLocal: "", normalizedE164: "", operator: "" };
  }

  // Strip all non-digit characters except leading '+'
  const cleaned = input.trim().replace(/[^\d+]/g, "");
  const match = cleaned.match(BD_MOBILE_REGEX);

  if (!match) {
    return { isValid: false, normalizedLocal: "", normalizedE164: "", operator: "" };
  }

  const nineDigitsWithLeadingOne = match[1]; // e.g. "1712345678"
  const prefix = nineDigitsWithLeadingOne.substring(0, 2);
  const normalizedLocal = `0${nineDigitsWithLeadingOne}`;
  const normalizedE164 = `+880${nineDigitsWithLeadingOne}`;
  const operator = OPERATOR_NAMES[prefix] || "Unknown";

  return {
    isValid: true,
    normalizedLocal,
    normalizedE164,
    operator,
  };
}

/**
 * Simple boolean validator for form schemas (Zod).
 */
export function isValidBdPhone(phone: string): boolean {
  return normalizeBdPhone(phone).isValid;
}
