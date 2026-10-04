// ==============================================================================
// SERVICES API ROUTE (/api/services)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Service } from "@/models/Service";
import { toPoisha } from "@/lib/money/poisha";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const featured = searchParams.get("featured");

    const query: Record<string, unknown> = { isActive: true };
    if (categoryId) query.categoryId = categoryId;
    if (featured === "true") query.isFeatured = true;

    const services = await Service.find(query)
      .populate("categoryId", "name slug")
      .populate("assignedStaffIds", "fullName designation avatarUrl")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: services });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      categoryId,
      description,
      price, // BDT amount from form
      durationMinutes,
      bufferBeforeMinutes,
      bufferAfterMinutes,
      imageUrl,
      assignedStaffIds,
      isFeatured,
      onlineBookingEnabled,
    } = body;

    if (!name || !categoryId || price === undefined) {
      return NextResponse.json(
        { success: false, message: "সার্ভিসের নাম, ক্যাটেগরি এবং মূল্য প্রদান আবশ্যক।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const slug = `${name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")}-${Date.now()}`;
    const priceMinor = toPoisha(price);

    const service = await Service.create({
      name,
      slug,
      categoryId,
      description: description || "",
      priceMinor,
      durationMinutes: Number(durationMinutes) || 30,
      bufferBeforeMinutes: Number(bufferBeforeMinutes) || 0,
      bufferAfterMinutes: Number(bufferAfterMinutes) || 5,
      imageUrl: imageUrl || "",
      assignedStaffIds: assignedStaffIds || [],
      isActive: true,
      isFeatured: Boolean(isFeatured),
      onlineBookingEnabled: onlineBookingEnabled !== false,
    });

    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
