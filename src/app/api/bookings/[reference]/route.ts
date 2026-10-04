// ==============================================================================
// APPOINTMENT BY REFERENCE ROUTE (/api/bookings/[reference])
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Appointment, BookingStatus } from "@/models/Appointment";
import { SlotReservation } from "@/models/SlotReservation";
import "@/models/Staff";
import "@/models/Customer";

const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["checked_in", "cancelled", "no_show"],
  checked_in: ["in_progress", "cancelled", "no_show"],
  in_progress: ["completed"],
  completed: [], // Immutable final state
  cancelled: [], // Immutable final state
  no_show: [],   // Immutable final state
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params;
    await connectToDatabase();

    const appointment = await Appointment.findOne({ bookingReference: reference })
      .populate("staffId", "fullName designation phone avatarUrl")
      .populate("customerId", "name phone email");

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "অ্যাপয়েন্টমেন্টটি পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: appointment,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("GET /api/bookings/[reference] error:", err);
    return NextResponse.json(
      { success: false, message: "সার্ভার ত্রুটি", error: err.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params;
    const body = await req.json().catch(() => ({}));
    const { status: nextStatus, internalNotes } = body;

    await connectToDatabase();
    const appointment = await Appointment.findOne({ bookingReference: reference });

    if (!appointment) {
      return NextResponse.json(
        { success: false, message: "অ্যাপয়েন্টমেন্টটি পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    if (nextStatus) {
      const allowedNext = VALID_TRANSITIONS[appointment.bookingStatus] || [];
      if (!allowedNext.includes(nextStatus)) {
        return NextResponse.json(
          {
            success: false,
            message: `'${appointment.bookingStatus}' অবস্থা থেকে '${nextStatus}' অবস্থায় পরিবর্তন করা নিয়মসম্মত নয়।`,
          },
          { status: 400 }
        );
      }

      appointment.bookingStatus = nextStatus;

      // If cancelled, delete slot reservations to free time for others
      if (nextStatus === "cancelled") {
        await SlotReservation.deleteMany({ appointmentId: appointment._id });
      }
    }

    if (internalNotes !== undefined) {
      appointment.internalNotes = internalNotes;
    }

    await appointment.save();

    return NextResponse.json({
      success: true,
      message: "অ্যাপয়েন্টমেন্টের অবস্থা সফলভাবে আপডেট করা হয়েছে।",
      data: appointment,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: "আপডেট করতে ব্যর্থ", error: err.message },
      { status: 500 }
    );
  }
}
