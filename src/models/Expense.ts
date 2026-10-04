// ==============================================================================
// EXPENSE MODEL
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExpense extends Document {
  title: string;
  category: "rent" | "utility" | "salary" | "inventory" | "maintenance" | "marketing" | "other";
  amountMinor: number; // In poisha
  expenseDate: Date;
  paymentMethod: string;
  description?: string;
  receiptUrl?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["rent", "utility", "salary", "inventory", "maintenance", "marketing", "other"],
      required: true,
      index: true,
    },
    amountMinor: {
      type: Number,
      required: true,
      min: 0,
    },
    expenseDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    paymentMethod: {
      type: String,
      default: "cash",
    },
    description: {
      type: String,
      default: "",
    },
    receiptUrl: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Expense: Model<IExpense> =
  mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);
