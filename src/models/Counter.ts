// ==============================================================================
// COUNTER MODEL (CONCURRENCY-SAFE SEQUENTIAL NUMBERING)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICounter extends Document {
  id: string; // e.g. "invoice_counter_2026"
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

export const Counter: Model<ICounter> =
  mongoose.models.Counter || mongoose.model<ICounter>("Counter", CounterSchema);

/**
 * Atomically increments and retrieves the next sequential number.
 */
export async function getNextSequence(counterId: string): Promise<number> {
  const counter = await Counter.findOneAndUpdate(
    { id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}
