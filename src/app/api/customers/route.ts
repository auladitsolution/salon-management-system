// ==============================================================================
// CUSTOMER (CRM) API ROUTE (/api/customers)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Customer } from "@/models/Customer";
import { normalizeBdPhone } from "@/lib/validation/phone";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const customers = await Customer.find(query).sort({ totalSpendMinor: -1 }).limit(100);
    return NextResponse.json({ success: true, data: customers });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, notes, gender } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "গ্রাহকের নাম ও মোবাইল নম্বর আবশ্যক।" },
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

    const existing = await Customer.findOne({ phone: phoneValidation.normalizedLocal });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "এই মোবাইল নম্বরে ইতোমধ্যে গ্রাহক নিবন্ধিত আছে।" },
        { status: 409 }
      );
    }

    const customer = await Customer.create({
      name,
      phone: phoneValidation.normalizedLocal,
      email: email || "",
      notes: notes || "",
      gender,
      totalSpendMinor: 0,
      totalVisits: 0,
    });

    return NextResponse.json({ success: true, data: customer }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
