// ==============================================================================
// APPOINTMENT AVAILABILITY API ROUTE (/api/availability)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { calculateAvailability } from "@/features/booking/availability";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const serviceIdsParam = searchParams.get("serviceIds");
    const staffId = searchParams.get("staffId") || undefined;

    if (!date) {
      return NextResponse.json(
        { success: false, message: "তারিখ প্রদান করা আবশ্যক।" },
        { status: 400 }
      );
    }

    if (!serviceIdsParam) {
      return NextResponse.json(
        { success: false, message: "সার্ভিস আইডি প্রদান করা আবশ্যক।" },
        { status: 400 }
      );
    }

    const serviceIds = serviceIdsParam.split(",").map((s) => s.trim()).filter(Boolean);

    const result = await calculateAvailability({
      date,
      serviceIds,
      staffId: staffId === "any" ? undefined : staffId,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Availability API error:", err);
    return NextResponse.json(
      { success: false, message: "সময়সূচী গণনায় ত্রুটি", error: err.message },
      { status: 500 }
    );
  }
}
