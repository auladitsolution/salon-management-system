// ==============================================================================
// FIRST-TIME ADMINISTRATOR BOOTSTRAP API ENDPOINT
// Salon Booking & Management System - Aulad IT Solution
//
// Rules:
// 1. Strictly requires BOOTSTRAP_SECRET_KEY.
// 2. Idempotent: If an owner account exists, rejects with 403 Forbidden.
// 3. Seeds initial business settings, service categories, and owner user profile.
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { User } from "@/models/User";
import { BusinessSettings } from "@/models/BusinessSettings";
import { ServiceCategory } from "@/models/ServiceCategory";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { secretKey } = body;

    const expectedSecret = process.env.BOOTSTRAP_SECRET_KEY || "aulad_it_secure_bootstrap_key_2026";
    if (!secretKey || secretKey !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: "ভুল সিক্রেট কি। অ্যাক্সেস প্রত্যাখ্যাত।" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Check if an owner account already exists
    const existingOwner = await User.findOne({ role: "owner" });
    if (existingOwner) {
      return NextResponse.json(
        {
          success: false,
          message: "অ্যাডমিনিস্ট্রেটর বুটস্ট্র্যাপ ইতোমধ্যে সম্পন্ন হয়েছে। পুনঃবুটস্ট্র্যাপ নিষিদ্ধ।",
        },
        { status: 403 }
      );
    }

    const adminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL || "admin@auladit.com";
    const adminPhone = process.env.BOOTSTRAP_ADMIN_PHONE || "01700000000";
    const adminName = process.env.BOOTSTRAP_ADMIN_NAME || "প্রধান অ্যাডমিন (Aulad IT)";

    // Create the master Owner account
    const ownerUser = await User.create({
      firebaseUid: `bootstrap_owner_${Date.now()}`,
      email: adminEmail,
      phone: adminPhone,
      fullName: adminName,
      role: "owner",
      status: "active",
    });

    // Create or update default Business Settings
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      settings = await BusinessSettings.create({
        salonName: "গ্ল্যামার লাউঞ্জ ও সেলুন",
        tagline: "আপনার সৌন্দর্য, আমাদের যত্ন",
        phone: adminPhone,
        email: adminEmail,
        address: "রোড ৪/এ, ধানমন্ডি, ঢাকা - ১২০৯",
        openingTime: "09:00",
        closingTime: "21:00",
        weeklyHolidays: [],
        slotIntervalMinutes: 30,
        bookingCutoffHours: 2,
        maxAdvanceDays: 30,
        currency: "BDT",
        currencySymbol: "৳",
        taxPercent: 5,
        invoicePrefix: "INV-2026-",
      });
    }

    // Seed initial Bengali service categories
    const initialCategories = [
      { name: "হেয়ার কাট ও স্টাইলিং", slug: "hair-cut-styling", orderIndex: 1 },
      { name: "দাড়ি ও গ্রুমিং", slug: "beard-grooming", orderIndex: 2 },
      { name: "ফেসিয়াল ও স্কিন কেয়ার", slug: "facial-skin-care", orderIndex: 3 },
      { name: "হেয়ার কালার ও ট্রিটমেন্ট", slug: "hair-color-treatment", orderIndex: 4 },
      { name: "ব্রাইডাল ও স্পেশাল মেকআপ", slug: "bridal-makeup", orderIndex: 5 },
      { name: "স্পা ও বডি ম্যাসাজ", slug: "spa-massage", orderIndex: 6 },
      { name: "ম্যানিকিউর ও পেডিকিউর", slug: "manicure-pedicure", orderIndex: 7 },
    ];

    for (const cat of initialCategories) {
      await ServiceCategory.findOneAndUpdate(
        { slug: cat.slug },
        { ...cat, isActive: true },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: "সিস্টেম বুটস্ট্র্যাপ সফল হয়েছে! প্রধান অ্যাডমিন অ্যাকাউন্ট তৈরি করা হয়েছে।",
      data: {
        adminEmail: ownerUser.email,
        role: ownerUser.role,
        salonName: settings.salonName,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Bootstrap error:", err);
    return NextResponse.json(
      { success: false, message: "বুটস্ট্র্যাপ প্রক্রিয়ায় ত্রুটি ঘটেছে", error: err.message },
      { status: 500 }
    );
  }
}
