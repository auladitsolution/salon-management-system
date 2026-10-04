// ==============================================================================
// STAFF MODEL (EMPLOYEES & STYLISTS)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStaff extends Document {
  fullName: string;
  phone: string;
  email?: string;
  designation: string;
  specialization: string[];
  assignedServiceIds: mongoose.Types.ObjectId[];
  workingDays: number[]; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  shiftStart: string;    // "09:00"
  shiftEnd: string;      // "20:00"
  commissionType: "none" | "fixed_minor" | "percentage";
  commissionValue: number; // e.g. 10 for 10% or 5000 for 50 BDT
  avatarUrl?: string;
  avatarPublicId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    fullName: {
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
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    specialization: {
      type: [String],
      default: [],
    },
    assignedServiceIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    workingDays: {
      type: [Number],
      default: [0, 1, 2, 3, 4, 6], // Default all except Friday (5) or configurable
    },
    shiftStart: {
      type: String,
      default: "09:00",
    },
    shiftEnd: {
      type: String,
      default: "20:00",
    },
    commissionType: {
      type: String,
      enum: ["none", "fixed_minor", "percentage"],
      default: "percentage",
    },
    commissionValue: {
      type: Number,
      default: 10, // 10% default
    },
    avatarUrl: {
      type: String,
    },
    avatarPublicId: {
      type: String,
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

export const Staff: Model<IStaff> =
  mongoose.models.Staff || mongoose.model<IStaff>("Staff", StaffSchema);
