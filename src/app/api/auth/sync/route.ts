// ==============================================================================
// AUTH SYNC API ENDPOINT
// Salon Booking & Management System - Aulad IT Solution
//
// Matches Firebase ID token with MongoDB User & Customer profile.
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { connectToDatabase } from "@/lib/db/connect";
import { User } from "@/models/User";
import { Customer } from "@/models/Customer";
import { ROLE_PERMISSIONS } from "@/lib/permissions/matrix";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "টোকেন পাওয়া যায়নি" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7).trim();
    const decoded = await verifyFirebaseIdToken(token);
    if (!decoded || !decoded.uid) {
      return NextResponse.json(
        { success: false, message: "অবৈধ অথরাইজেশন টোকেন" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await req.json().catch(() => ({}));
    const phone = body.phone || decoded.phone_number || "";
    const name = body.name || decoded.name || "গ্রাহক";
    const email = decoded.email || body.email;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "ইমেইল পাওয়া যায়নি" },
        { status: 400 }
      );
    }

    // Find or create User
    let user = await User.findOne({
      $or: [{ firebaseUid: decoded.uid }, { email: email.toLowerCase() }],
    });

    if (!user) {
      // Create Customer profile if phone provided
      let customerId;
      if (phone) {
        let customer = await Customer.findOne({ phone });
        if (!customer) {
          customer = await Customer.create({
            name,
            phone,
            email,
          });
        }
        customerId = customer._id;
      }

      user = await User.create({
        firebaseUid: decoded.uid,
        email: email.toLowerCase(),
        phone,
        fullName: name,
        role: "customer", // Strict default: NEVER admin
        status: "active",
        customerProfileId: customerId,
        avatarUrl: decoded.picture || "",
      });
    } else if (user.firebaseUid !== decoded.uid) {
      // Link firebaseUid if registered by email
      user.firebaseUid = decoded.uid;
      await user.save();
    }

    if (user.status !== "active") {
      return NextResponse.json(
        { success: false, message: "আপনার অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        permissions: ROLE_PERMISSIONS[user.role] || [],
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Auth sync error:", err);
    return NextResponse.json(
      { success: false, message: "লগইন সিনক্রোনাইজেশনে ত্রুটি", error: err.message },
      { status: 500 }
    );
  }
}
