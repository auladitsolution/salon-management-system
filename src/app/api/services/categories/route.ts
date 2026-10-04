// ==============================================================================
// SERVICE CATEGORIES API ROUTE (/api/services/categories)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { ServiceCategory } from "@/models/ServiceCategory";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await ServiceCategory.find({ isActive: true }).sort({ orderIndex: 1 });
    return NextResponse.json({ success: true, data: categories });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("GET /api/services/categories error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body;
    if (!name) {
      return NextResponse.json({ success: false, message: "ক্যাটেগরির নাম আবশ্যক।" }, { status: 400 });
    }

    await connectToDatabase();
    const slug = name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") || `cat-${Date.now()}`;

    const category = await ServiceCategory.create({
      name,
      slug,
      description: description || "",
      orderIndex: 0,
      isActive: true,
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
