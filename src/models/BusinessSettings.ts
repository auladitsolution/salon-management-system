// ==============================================================================
// BUSINESS SETTINGS MODEL (SALON CONFIGURATION & BRANDING)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBusinessSettings extends Document {
  salonName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  logoUrl?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
  openingTime: string;      // e.g. "09:00"
  closingTime: string;      // e.g. "21:00"
  weeklyHolidays: number[]; // e.g. [5] for Friday
  slotIntervalMinutes: number; // 15 or 30
  bookingCutoffHours: number;  // minimum hours in advance
  maxAdvanceDays: number;      // maximum days in advance
  currency: string;
  currencySymbol: string;
  taxPercent: number;          // Default VAT percentage (e.g. 5)
  invoicePrefix: string;       // e.g. "INV-2026-"
  features: {
    onlineBooking: boolean;
    guestBooking: boolean;
    staffManagement: boolean;
    attendance: boolean;
    commissions: boolean;
    pos: boolean;
    inventory: boolean;
    expenses: boolean;
    offers: boolean;
    reviews: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    googleMaps?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSettingsSchema = new Schema<IBusinessSettings>(
  {
    salonName: {
      type: String,
      required: true,
      default: "গ্ল্যামার লাউঞ্জ ও সেলুন",
      trim: true,
    },
    tagline: {
      type: String,
      default: "আপনার সৌন্দর্য, আমাদের যত্ন",
    },
    phone: {
      type: String,
      required: true,
      default: "01700000000",
    },
    email: {
      type: String,
      default: "contact@auladit.com",
    },
    address: {
      type: String,
      default: "ধানমন্ডি, ঢাকা - ১২০৯",
    },
    logoUrl: {
      type: String,
    },
    heroTitle: {
      type: String,
      default: "আপনার সৌন্দর্য, আমাদের যত্ন",
    },
    heroSubtitle: {
      type: String,
      default: "অভিজ্ঞ স্টাইলিস্ট এবং প্রিমিয়াম কেয়ারের সাথে নিজেকে সাজিয়ে তুলুন সেরা রূপে।",
    },
    heroImageUrl: {
      type: String,
    },
    openingTime: {
      type: String,
      default: "09:00",
    },
    closingTime: {
      type: String,
      default: "21:00",
    },
    weeklyHolidays: {
      type: [Number],
      default: [], // Open 7 days or configurable
    },
    slotIntervalMinutes: {
      type: Number,
      default: 30,
    },
    bookingCutoffHours: {
      type: Number,
      default: 2,
    },
    maxAdvanceDays: {
      type: Number,
      default: 30,
    },
    currency: {
      type: String,
      default: "BDT",
    },
    currencySymbol: {
      type: String,
      default: "৳",
    },
    taxPercent: {
      type: Number,
      default: 5,
    },
    invoicePrefix: {
      type: String,
      default: "INV-",
    },
    features: {
      onlineBooking: { type: Boolean, default: true },
      guestBooking: { type: Boolean, default: true },
      staffManagement: { type: Boolean, default: true },
      attendance: { type: Boolean, default: true },
      commissions: { type: Boolean, default: true },
      pos: { type: Boolean, default: true },
      inventory: { type: Boolean, default: true },
      expenses: { type: Boolean, default: true },
      offers: { type: Boolean, default: true },
      reviews: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: false },
      smsNotifications: { type: Boolean, default: false },
    },
    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      googleMaps: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

export const BusinessSettings: Model<IBusinessSettings> =
  mongoose.models.BusinessSettings ||
  mongoose.model<IBusinessSettings>("BusinessSettings", BusinessSettingsSchema);

/**
 * Helper to retrieve singleton BusinessSettings or initialize with defaults.
 */
export async function getBusinessSettings(): Promise<IBusinessSettings> {
  let settings = await BusinessSettings.findOne();
  if (!settings) {
    settings = await BusinessSettings.create({
      salonName: "গ্ল্যামার লাউঞ্জ ও সেলুন",
      tagline: "আপনার সৌন্দর্য, আমাদের যত্ন",
      phone: "01700000000",
      email: "contact@auladit.com",
      address: "রোড ৪/এ, ধানমন্ডি, ঢাকা",
    });
  }
  return settings;
}
