// ==============================================================================
// APPOINTMENT MODEL
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointmentServiceSnapshot {
  serviceId: mongoose.Types.ObjectId;
  name: string;
  priceMinor: number;
  durationMinutes: number;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

export type PaymentStatus =
  | "unpaid"
  | "partially_paid"
  | "paid"
  | "refunded";

export interface IAppointment extends Document {
  bookingReference: string;
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  guestVerificationCode?: string;
  staffId: mongoose.Types.ObjectId;
  appointmentDate: string; // YYYY-MM-DD
  startTime: string;       // HH:mm
  endTime: string;         // HH:mm
  totalDurationMinutes: number;
  services: IAppointmentServiceSnapshot[];
  subtotalMinor: number;
  discountMinor: number;
  totalMinor: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  customerNotes?: string;
  internalNotes?: string;
  invoiceId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentServiceSnapshotSchema = new Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    priceMinor: {
      type: Number,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const AppointmentSchema = new Schema<IAppointment>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      index: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    guestVerificationCode: {
      type: String,
    },
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
      index: true,
    },
    appointmentDate: {
      type: String,
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    totalDurationMinutes: {
      type: Number,
      required: true,
    },
    services: {
      type: [AppointmentServiceSnapshotSchema],
      required: true,
    },
    subtotalMinor: {
      type: Number,
      required: true,
    },
    discountMinor: {
      type: Number,
      default: 0,
    },
    totalMinor: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "checked_in", "in_progress", "completed", "cancelled", "no_show"],
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partially_paid", "paid", "refunded"],
      default: "unpaid",
      index: true,
    },
    customerNotes: {
      type: String,
      default: "",
    },
    internalNotes: {
      type: String,
      default: "",
    },
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
    },
  },
  {
    timestamps: true,
  }
);

AppointmentSchema.index({ appointmentDate: 1, staffId: 1 });
AppointmentSchema.index({ bookingStatus: 1, appointmentDate: 1 });

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
