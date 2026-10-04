// ==============================================================================
// USER MODEL (RBAC & IDENTITY)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";
import { UserRole } from "@/lib/permissions/matrix";

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  phone?: string;
  fullName: string;
  role: UserRole;
  status: "active" | "inactive" | "suspended";
  staffProfileId?: mongoose.Types.ObjectId;
  customerProfileId?: mongoose.Types.ObjectId;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["owner", "manager", "receptionist", "staff", "customer", "guest"],
      default: "customer",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
      index: true,
    },
    staffProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
    },
    customerProfileId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
    },
    avatarUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
