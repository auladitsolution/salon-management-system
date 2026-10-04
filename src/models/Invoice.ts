// ==============================================================================
// INVOICE & BILLING MODEL
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvoiceItem {
  type: "service" | "product";
  referenceId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  unitPriceMinor: number;
  totalMinor: number;
  staffId?: mongoose.Types.ObjectId;
}

export interface IInvoicePayment {
  method: "cash" | "bkash" | "nagad" | "rocket" | "bank" | "card" | "other";
  amountMinor: number;
  transactionRef?: string;
  isManualVerified: boolean;
  paidAt: Date;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  appointmentId?: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  customerName: string;
  customerPhone: string;
  items: IInvoiceItem[];
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalAmountMinor: number;
  paidAmountMinor: number;
  dueAmountMinor: number;
  paymentStatus: "unpaid" | "partially_paid" | "paid" | "refunded" | "voided";
  payments: IInvoicePayment[];
  notes?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["service", "product"],
      required: true,
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    unitPriceMinor: {
      type: Number,
      required: true,
    },
    totalMinor: {
      type: Number,
      required: true,
    },
    staffId: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
    },
  },
  { _id: false }
);

const InvoicePaymentSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["cash", "bkash", "nagad", "rocket", "bank", "card", "other"],
      required: true,
    },
    amountMinor: {
      type: Number,
      required: true,
    },
    transactionRef: {
      type: String,
      default: "",
    },
    isManualVerified: {
      type: Boolean,
      default: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoice>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
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
    items: {
      type: [InvoiceItemSchema],
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
    taxMinor: {
      type: Number,
      default: 0,
    },
    totalAmountMinor: {
      type: Number,
      required: true,
    },
    paidAmountMinor: {
      type: Number,
      default: 0,
    },
    dueAmountMinor: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "partially_paid", "paid", "refunded", "voided"],
      default: "unpaid",
      index: true,
    },
    payments: {
      type: [InvoicePaymentSchema],
      default: [],
    },
    notes: {
      type: String,
      default: "",
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

export const Invoice: Model<IInvoice> =
  mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
