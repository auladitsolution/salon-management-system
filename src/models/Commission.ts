// ==============================================================================
// STAFF COMMISSION MODEL
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICommission extends Document {
  staffId: mongoose.Types.ObjectId;
  appointmentId?: mongoose.Types.ObjectId;
  invoiceId?: mongoose.Types.ObjectId;
  serviceName: string;
  serviceAmountMinor: number;
  commissionAmountMinor: number;
  status: "pending" | "approved" | "paid" | "cancelled";
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CommissionSchema = new Schema<ICommission>(
  {
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
      index: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      index: true,
    },
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      index: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    serviceAmountMinor: {
      type: Number,
      required: true,
    },
    commissionAmountMinor: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "cancelled"],
      default: "pending",
      index: true,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const Commission: Model<ICommission> =
  mongoose.models.Commission ||
  mongoose.model<ICommission>("Commission", CommissionSchema);
