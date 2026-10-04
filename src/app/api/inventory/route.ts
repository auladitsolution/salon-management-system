// ==============================================================================
// INVENTORY & PRODUCTS API ROUTE (/api/inventory)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Product } from "@/models/Product";
import { StockMovement } from "@/models/StockMovement";
import { toPoisha } from "@/lib/money/poisha";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const lowStock = searchParams.get("lowStock");

    const query: Record<string, unknown> = { isActive: true };
    const products = await Product.find(query).sort({ name: 1 });

    if (lowStock === "true") {
      const filtered = products.filter((p) => p.currentStock <= p.reorderLevel);
      return NextResponse.json({ success: true, data: filtered });
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, sku, category, costPrice, sellingPrice, initialStock, reorderLevel, unit } = body;

    if (!name || !sku || costPrice === undefined || sellingPrice === undefined) {
      return NextResponse.json(
        { success: false, message: "পণ্যের নাম, SKU, ক্রয়মূল্য এবং বিক্রয়মূল্য আবশ্যক।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await Product.findOne({ sku: sku.trim().toUpperCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "এই SKU কোডের পণ্য ইতোমধ্যে রয়েছে।" },
        { status: 409 }
      );
    }

    const currentStock = Math.max(0, Number(initialStock) || 0);

    const product = await Product.create({
      name: name.trim(),
      sku: sku.trim().toUpperCase(),
      category: category || "জেনারেল",
      costPriceMinor: toPoisha(costPrice),
      sellingPriceMinor: toPoisha(sellingPrice),
      currentStock,
      reorderLevel: Number(reorderLevel) || 5,
      unit: unit || "পিস",
      isActive: true,
    });

    if (currentStock > 0) {
      await StockMovement.create({
        productId: product._id,
        type: "in",
        quantity: currentStock,
        previousStock: 0,
        newStock: currentStock,
        reason: "প্রাথমিক স্টক এন্ট্রি",
      });
    }

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
