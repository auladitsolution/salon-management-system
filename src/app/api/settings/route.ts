// ==============================================================================
// BUSINESS SETTINGS API ROUTE (/api/settings)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { BusinessSettings, getBusinessSettings } from "@/models/BusinessSettings";
import { toAsciiNumerals } from "@/lib/money/poisha";

export async function GET() {
  try {
    await connectToDatabase();
    const settings = await getBusinessSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    await connectToDatabase();

    if (body.openingTime) {
      body.openingTime = toAsciiNumerals(body.openingTime);
    }
    if (body.closingTime) {
      body.closingTime = toAsciiNumerals(body.closingTime);
    }

    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = await BusinessSettings.create(body);
    } else {
      Object.assign(settings, body);
      await settings.save();
    }

    return NextResponse.json({
      success: true,
      message: "সেটিংস সফলভাবে সংরক্ষিত হয়েছে।",
      data: settings,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
