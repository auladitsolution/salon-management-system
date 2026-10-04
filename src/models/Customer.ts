// ==============================================================================
// CUSTOMER MODEL (CRM & PROFILES)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICustomer extends Document {
  name: string;
  phone: string;
  email?: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: Date;
  notes?: string;
  totalSpendMinor: number; // Integer poisha
  totalVisits: number;
  lastVisitDate?: Date;
  preferredStaffId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    dateOfBirth: {
      type: Date,
    },
    notes: {
      type: String,
      default: "",
    },
    totalSpendMinor: {
      type: Number,
      default: 0, // In poisha
    },
    totalVisits: {
      type: Number,
      default: 0,
    },
    lastVisitDate: {
      type: Date,
    },
    preferredStaffId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
    },
  },
  {
    timestamps: true,
  }
);

export const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>("Customer", CustomerSchema);
