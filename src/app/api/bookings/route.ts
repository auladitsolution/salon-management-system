// ==============================================================================
// APPOINTMENT CREATION & BOOKING ENGINE API ROUTE (/api/bookings)
// Salon Booking & Management System - Aulad IT Solution
//
// Concurrency Protected via Atomic Slot Reservations
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Appointment } from "@/models/Appointment";
import { SlotReservation } from "@/models/SlotReservation";
import { Service } from "@/models/Service";
import { Staff } from "@/models/Staff";
import { Customer } from "@/models/Customer";
import { BusinessSettings } from "@/models/BusinessSettings";
import { normalizeBdPhone } from "@/lib/validation/phone";
import { toBengaliNumerals } from "@/lib/money/poisha";
import crypto from "crypto";

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      serviceIds,
      staffId: requestedStaffId,
      appointmentDate,
      startTime,
      customerName,
      customerPhone,
      customerEmail,
      customerNotes,
    } = body;

    // 1. Basic Validation
    if (!serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "কমপক্ষে একটি সার্ভিস নির্বাচন করুন।" },
        { status: 400 }
      );
    }

    if (!appointmentDate || !startTime) {
      return NextResponse.json(
        { success: false, message: "তারিখ ও সময় নির্বাচন করা আবশ্যক।" },
        { status: 400 }
      );
    }

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, message: "গ্রাহকের নাম ও মোবাইল নম্বর দেওয়া আবশ্যক।" },
        { status: 400 }
      );
    }

    const phoneValidation = normalizeBdPhone(customerPhone);
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { success: false, message: "সঠিক বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 2. Fetch Services and calculate price & duration
    const services = await Service.find({
      _id: { $in: serviceIds },
      isActive: true,
    });

    if (services.length === 0) {
      return NextResponse.json(
        { success: false, message: "নির্বাচিত সার্ভিসসমূহ পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    const serviceDuration = services.reduce((acc, s) => acc + s.durationMinutes, 0);
    const maxBufferAfter = Math.max(...services.map((s) => s.bufferAfterMinutes || 0), 0);
    const totalDurationMinutes = serviceDuration + maxBufferAfter;
    const subtotalMinor = services.reduce((acc, s) => acc + s.priceMinor, 0);

    const startM = timeToMinutes(startTime);
    const endM = startM + totalDurationMinutes;
    const endTime = minutesToTime(endM);

    // 3. Resolve Staff Member (Specified or Any Available)
    let assignedStaffId = requestedStaffId;
    if (!assignedStaffId || assignedStaffId === "any") {
      const activeStaff = await Staff.find({ isActive: true });
      if (activeStaff.length === 0) {
        return NextResponse.json(
          { success: false, message: "কোনো সক্রিয় কর্মী পাওয়া যায়নি।" },
          { status: 400 }
        );
      }
      assignedStaffId = activeStaff[0]._id.toString();
    }

    const staffMember = await Staff.findById(assignedStaffId);
    if (!staffMember || !staffMember.isActive) {
      return NextResponse.json(
        { success: false, message: "নির্বাচিত কর্মীকে পাওয়া যায়নি বা তিনি নিষ্ক্রিয় আছেন।" },
        { status: 404 }
      );
    }

    // 4. Generate Reservation Time Slots (e.g. 15 or 30-min intervals)
    const settings = await BusinessSettings.findOne();
    const slotInterval = settings?.slotIntervalMinutes || 30;

    const slotTimesToReserve: string[] = [];
    for (let m = startM; m < endM; m += slotInterval) {
      slotTimesToReserve.push(minutesToTime(m));
    }

    // 5. ATOMIC CONCURRENCY LOCK VIA SlotReservation
    // Attempt to insert reservations for all covered slots
    const insertedReservations: InstanceType<typeof SlotReservation>[] = [];
    try {
      for (const slot of slotTimesToReserve) {
        const reservation = await SlotReservation.create({
          staffId: staffMember._id,
          bookingDate: appointmentDate,
          slotTime: slot,
        });
        insertedReservations.push(reservation);
      }
    } catch (concurrencyErr: unknown) {
      // Clean up any slots already inserted in this failed attempt
      if (insertedReservations.length > 0) {
        await SlotReservation.deleteMany({
          _id: { $in: insertedReservations.map((r) => r._id) },
        });
      }

      console.warn("Slot collision caught:", concurrencyErr);
      return NextResponse.json(
        {
          success: false,
          message: "দুঃখিত, এই সময়টি ইতোমধ্যে বুক করা হয়েছে। অনুগ্রহ করে অন্য সময় নির্বাচন করুন।",
        },
        { status: 409 }
      );
    }

    // 6. Generate Human-Friendly Booking Reference
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const currentYear = new Date().getFullYear();
    const bookingReference = `SB-${currentYear}-${randomHex}`;
    const guestVerificationCode = crypto.randomBytes(4).toString("hex");

    // 7. Find or Create Customer Profile
    let customer = await Customer.findOne({ phone: phoneValidation.normalizedLocal });
    if (!customer) {
      customer = await Customer.create({
        name: customerName.trim(),
        phone: phoneValidation.normalizedLocal,
        email: customerEmail || "",
        totalSpendMinor: 0,
        totalVisits: 0,
      });
    }

    // 8. Create Appointment Document
    const serviceSnapshots = services.map((s) => ({
      serviceId: s._id,
      name: s.name,
      priceMinor: s.priceMinor,
      durationMinutes: s.durationMinutes,
    }));

    const appointment = await Appointment.create({
      bookingReference,
      customerId: customer._id,
      customerName: customerName.trim(),
      customerPhone: phoneValidation.normalizedLocal,
      customerEmail: customerEmail || "",
      guestVerificationCode,
      staffId: staffMember._id,
      appointmentDate,
      startTime,
      endTime,
      totalDurationMinutes,
      services: serviceSnapshots,
      subtotalMinor,
      discountMinor: 0,
      totalMinor: subtotalMinor,
      bookingStatus: "pending",
      paymentStatus: "unpaid",
      customerNotes: customerNotes || "",
    });

    // Link appointmentId back to reservations
    await SlotReservation.updateMany(
      { _id: { $in: insertedReservations.map((r) => r._id) } },
      { $set: { appointmentId: appointment._id } }
    );

    return NextResponse.json(
      {
        success: true,
        message: "আপনার অ্যাপয়েন্টমেন্ট সফলভাবে বুক করা হয়েছে!",
        data: {
          bookingReference: appointment.bookingReference,
          verificationCode: guestVerificationCode,
          customerName: appointment.customerName,
          appointmentDate: appointment.appointmentDate,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          staffName: staffMember.fullName,
          totalDurationMinutes: appointment.totalDurationMinutes,
          totalMinor: appointment.totalMinor,
          services: appointment.services,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Booking creation error:", err);
    return NextResponse.json(
      { success: false, message: "বুকিং সম্পন্নে সমস্যা হয়েছে", error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const staffId = searchParams.get("staffId");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};

    if (date) query.appointmentDate = date;
    if (status) query.bookingStatus = status;
    if (staffId) query.staffId = staffId;
    if (search) {
      query.$or = [
        { bookingReference: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
      ];
    }

    const appointments = await Appointment.find(query)
      .populate("staffId", "fullName designation phone avatarUrl")
      .sort({ appointmentDate: -1, startTime: 1 })
      .limit(100);

    return NextResponse.json({
      success: true,
      data: appointments,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, message: "অ্যাপয়েন্টমেন্ট তালিকা লোড করতে সমস্যা হয়েছে", error: err.message },
      { status: 500 }
    );
  }
}
