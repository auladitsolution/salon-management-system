// ==============================================================================
// SERVICE MODEL (SALON CATALOG)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IService extends Document {
  name: string;
  slug: string;
  categoryId: mongoose.Types.ObjectId;
  description: string;
  priceMinor: number; // Integer poisha (e.g., 50000 = ৳ 500)
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  imageUrl?: string;
  imagePublicId?: string;
  assignedStaffIds: mongoose.Types.ObjectId[];
  isActive: boolean;
  isFeatured: boolean;
  onlineBookingEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "ServiceCategory",
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      default: "",
    },
    priceMinor: {
      type: Number,
      required: true,
      min: 0,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 5,
      default: 30,
    },
    bufferBeforeMinutes: {
      type: Number,
      default: 0,
    },
    bufferAfterMinutes: {
      type: Number,
      default: 5,
    },
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
    assignedStaffIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Staff",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    onlineBookingEnabled: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
