// ==============================================================================
// STAFF ATTENDANCE API ROUTE (/api/staff/attendance)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Attendance } from "@/models/Attendance";
import { getDhakaTodayString } from "@/lib/dates/bengaliDate";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") || getDhakaTodayString();

    const attendanceRecords = await Attendance.find({ date })
      .populate("staffId", "fullName designation phone avatarUrl")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: attendanceRecords });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { staffId, date, checkInTime, checkOutTime, status, notes } = body;

    if (!staffId) {
      return NextResponse.json(
        { success: false, message: "কর্মী নির্বাচন করা আবশ্যক।" },
        { status: 400 }
      );
    }

    const attendanceDate = date || getDhakaTodayString();

    await connectToDatabase();

    const record = await Attendance.findOneAndUpdate(
      { staffId, date: attendanceDate },
      {
        $set: {
          checkInTime,
          checkOutTime,
          status: status || "present",
          notes: notes || "",
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "উপস্থিতি তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।",
      data: record,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
