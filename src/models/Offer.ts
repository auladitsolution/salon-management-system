// ==============================================================================
// PROMOTIONAL OFFER & COUPON MODEL
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOffer extends Document {
  title: string;
  code: string;
  discountType: "percentage" | "fixed_minor";
  discountValue: number; // e.g. 15 for 15% or 10000 for 100 BDT
  startDate: Date;
  endDate: Date;
  minSpendMinor?: number;
  maxDiscountMinor?: number;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed_minor"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 1,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    minSpendMinor: {
      type: Number,
      default: 0,
    },
    maxDiscountMinor: {
      type: Number,
    },
    usageLimit: {
      type: Number,
      default: 100,
    },
    timesUsed: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Offer: Model<IOffer> =
  mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);
