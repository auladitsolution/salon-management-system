// ==============================================================================
// PRODUCT MODEL (INVENTORY & RETAIL)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  costPriceMinor: number;    // Poisha
  sellingPriceMinor: number; // Poisha
  currentStock: number;
  reorderLevel: number;
  unit: string; // e.g. "পিস", "বোতল"
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    costPriceMinor: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPriceMinor: {
      type: Number,
      required: true,
      min: 0,
    },
    currentStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    reorderLevel: {
      type: Number,
      default: 5,
    },
    unit: {
      type: String,
      default: "পিস",
    },
    imageUrl: {
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

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
