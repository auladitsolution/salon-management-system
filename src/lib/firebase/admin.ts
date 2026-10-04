// ==============================================================================
// FIREBASE ADMIN SDK (SERVER-SIDE ONLY)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import admin from "firebase-admin";

function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  return key.replace(/\\n/g, "\n");
}

export function getFirebaseAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (!projectId || !clientEmail || !privateKey) {
    // Return or throw detailed error when running in production
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Missing Firebase Admin credentials in environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)."
      );
    }
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: projectId || "mock-project",
      clientEmail: clientEmail || "mock@mock.iam.gserviceaccount.com",
      privateKey: privateKey || "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3\n-----END PRIVATE KEY-----\n",
    }),
  });
}

/**
 * Verifies an incoming Firebase Bearer ID Token.
 */
export async function verifyFirebaseIdToken(token: string): Promise<admin.auth.DecodedIdToken | null> {
  try {
    const adminApp = getFirebaseAdminApp();
    const decodedToken = await adminApp.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Firebase ID Token verification failed:", error);
    return null;
  }
}
