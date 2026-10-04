// ==============================================================================
// STOCK MOVEMENT API ROUTE (/api/inventory/movement)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Product } from "@/models/Product";
import { StockMovement, StockMovementType } from "@/models/StockMovement";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, type, quantity, reason } = body;

    if (!productId || !type || !quantity || !reason) {
      return NextResponse.json(
        { success: false, message: "পণ্য, মুভমেন্ট টাইপ, পরিমাণ এবং কারণ আবশ্যক।" },
        { status: 400 }
      );
    }

    const qty = Math.max(1, Math.floor(Number(quantity)));
    await connectToDatabase();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "পণ্যটি পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const prevStock = product.currentStock;
    let newStock = prevStock;

    if (type === "in" || type === "return") {
      newStock = prevStock + qty;
    } else if (type === "out" || type === "sale") {
      if (prevStock < qty) {
        return NextResponse.json(
          { success: false, message: "স্টকে পর্যাপ্ত পণ্য নেই।" },
          { status: 400 }
        );
      }
      newStock = prevStock - qty;
    } else if (type === "adjustment") {
      newStock = qty; // Direct adjustment to this count
    }

    product.currentStock = newStock;
    await product.save();

    const movement = await StockMovement.create({
      productId: product._id,
      type: type as StockMovementType,
      quantity: qty,
      previousStock: prevStock,
      newStock,
      reason,
    });

    return NextResponse.json({
      success: true,
      message: "স্টক সফলভাবে আপডেট হয়েছে।",
      data: movement,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    const query: Record<string, unknown> = {};
    if (productId) query.productId = productId;

    const movements = await StockMovement.find(query)
      .populate("productId", "name sku")
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ success: true, data: movements });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("GET /api/inventory/movement error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
