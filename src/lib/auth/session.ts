// ==============================================================================
// SERVER-SIDE SESSION & AUTHENTICATION HELPER
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { connectToDatabase } from "@/lib/db/connect";
import { User, IUser } from "@/models/User";
import { hasPermission, Permission, UserRole } from "@/lib/permissions/matrix";

export interface AuthenticatedContext {
  user: IUser;
  role: UserRole;
  firebaseUid: string;
  email: string;
}

/**
 * Extracts and verifies the user session from the incoming NextRequest.
 */
export async function getAuthenticatedUser(
  req: NextRequest
): Promise<AuthenticatedContext | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7).trim();
  if (!token) return null;

  try {
    const decoded = await verifyFirebaseIdToken(token);
    if (!decoded || !decoded.uid) {
      return null;
    }

    await connectToDatabase();
    const user = await User.findOne({ firebaseUid: decoded.uid });

    if (!user || user.status !== "active") {
      return null;
    }

    return {
      user,
      role: user.role,
      firebaseUid: decoded.uid,
      email: user.email,
    };
  } catch (error) {
    console.error("Auth context error:", error);
    return null;
  }
}

/**
 * Higher-order guard ensuring the caller has the required permission.
 */
export async function requirePermission(
  req: NextRequest,
  permission: Permission
): Promise<{ auth: AuthenticatedContext } | { errorResponse: NextResponse }> {
  const auth = await getAuthenticatedUser(req);

  if (!auth) {
    return {
      errorResponse: NextResponse.json(
        { success: false, message: "অননুমোদিত অ্যাক্সেস। অনুগ্রহ করে লগইন করুন।" },
        { status: 401 }
      ),
    };
  }

  if (!hasPermission(auth.role, permission)) {
    return {
      errorResponse: NextResponse.json(
        { success: false, message: "এই কাজটি করার জন্য আপনার অনুমতি নেই।" },
        { status: 403 }
      ),
    };
  }

  return { auth };
}
