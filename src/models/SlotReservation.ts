// ==============================================================================
// SLOT RESERVATION MODEL (CONCURRENCY LOCKS)
// Salon Booking & Management System - Aulad IT Solution
//
// Guarantees zero double bookings through compound unique indexing.
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISlotReservation extends Document {
  staffId: mongoose.Types.ObjectId;
  bookingDate: string; // YYYY-MM-DD
  slotTime: string;    // HH:mm (e.g. "14:30")
  appointmentId?: mongoose.Types.ObjectId;
  expiresAt?: Date;    // TTL for unconfirmed hold
  createdAt: Date;
}

const SlotReservationSchema = new Schema<ISlotReservation>(
  {
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
      index: true,
    },
    bookingDate: {
      type: String,
      required: true,
      index: true,
    },
    slotTime: {
      type: String,
      required: true,
      index: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
    },
    expiresAt: {
      type: Date,
      index: { expires: 0 }, // Optional TTL index
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound Unique Index: ABSOLUTELY PREVENTS DOUBLE BOOKINGS
SlotReservationSchema.index(
  { staffId: 1, bookingDate: 1, slotTime: 1 },
  { unique: true }
);

export const SlotReservation: Model<ISlotReservation> =
  mongoose.models.SlotReservation ||
  mongoose.model<ISlotReservation>("SlotReservation", SlotReservationSchema);
