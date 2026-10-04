// ==============================================================================
// STOCK MOVEMENT AUDIT LEDGER MODEL
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export type StockMovementType = "in" | "out" | "adjustment" | "sale" | "return";

export interface IStockMovement extends Document {
  productId: mongoose.Types.ObjectId;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  referenceId?: string; // e.g. Invoice ID or adjustment ref
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const StockMovementSchema = new Schema<IStockMovement>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["in", "out", "adjustment", "sale", "return"],
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    referenceId: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const StockMovement: Model<IStockMovement> =
  mongoose.models.StockMovement ||
  mongoose.model<IStockMovement>("StockMovement", StockMovementSchema);
