// ==============================================================================
// AUTH ME API ENDPOINT (/api/auth/me)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { ROLE_PERMISSIONS } from "@/lib/permissions/matrix";

export async function GET(req: NextRequest) {
  try {
    const authContext = await getAuthenticatedUser(req);
    if (!authContext) {
      return NextResponse.json(
        { success: false, message: "অননুমোদিত" },
        { status: 401 }
      );
    }

    const { user } = authContext;

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
    return NextResponse.json(
      { success: false, message: "সার্ভার ত্রুটি", error: err.message },
      { status: 500 }
    );
  }
}
