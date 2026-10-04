// ==============================================================================
// STAFF API ROUTE (/api/staff)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Staff } from "@/models/Staff";
import { normalizeBdPhone } from "@/lib/validation/phone";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");

    const query: Record<string, unknown> = { isActive: true };
    if (serviceId) {
      query.assignedServiceIds = serviceId;
    }

    const staffList = await Staff.find(query).populate("assignedServiceIds", "name priceMinor durationMinutes");
    return NextResponse.json({ success: true, data: staffList });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      phone,
      email,
      designation,
      specialization,
      assignedServiceIds,
      workingDays,
      shiftStart,
      shiftEnd,
      commissionType,
      commissionValue,
      avatarUrl,
    } = body;

    if (!fullName || !phone || !designation) {
      return NextResponse.json(
        { success: false, message: "কর্মীর পূর্ণ নাম, মোবাইল নম্বর এবং পদবী আবশ্যক।" },
        { status: 400 }
      );
    }

    const phoneValidation = normalizeBdPhone(phone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { success: false, message: "সঠিক বাংলাদেশি মোবাইল নম্বর দিন।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const staff = await Staff.create({
      fullName,
      phone: phoneValidation.normalizedLocal,
      email: email || "",
      designation,
      specialization: Array.isArray(specialization) ? specialization : [],
      assignedServiceIds: assignedServiceIds || [],
      workingDays: workingDays || [0, 1, 2, 3, 4, 6],
      shiftStart: shiftStart || "09:00",
      shiftEnd: shiftEnd || "20:00",
      commissionType: commissionType || "percentage",
      commissionValue: Number(commissionValue) || 10,
      avatarUrl: avatarUrl || "",
      isActive: true,
    });

    return NextResponse.json({ success: true, data: staff }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
