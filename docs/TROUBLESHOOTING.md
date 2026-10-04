# Troubleshooting and Diagnostics Guide
**Salon Booking & Management System - Aulad IT Solution**

## 1. Common Issues and Resolutions

### 1.1. MongoDB Connection Timeouts or Replica Set Errors
**Symptoms:** `MongoServerSelectionError: connection timed out` or transactions failing.
**Root Causes:**
- IP whitelist in MongoDB Atlas Network Access is not configured.
- Replica sets are disabled (standalone MongoDB cannot run multi-document transactions).
**Resolution:**
- In MongoDB Atlas > Network Access, add `0.0.0.0/0` (with strong password auth) or Vercel's IP ranges.
- Ensure the connection URI includes `?retryWrites=true&w=majority`.

### 1.2. Firebase Admin Initialization Failure
**Symptoms:** `FirebaseAppError: Failed to parse service account private key`.
**Root Causes:**
- Newlines in `FIREBASE_PRIVATE_KEY` were improperly escaped when copied into Vercel or `.env.local`.
**Resolution:**
- Ensure `FIREBASE_PRIVATE_KEY` wraps the key in quotes and uses literal `\n`, e.g.:
  `FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgI...\n-----END PRIVATE KEY-----\n"`
- The initialization helper in `src/lib/firebase/admin.ts` automatically runs `.replace(/\\n/g, '\n')` to sanitize.

### 1.3. Bengali Font Hind Siliguri Not Rendering
**Symptoms:** Text falls back to Arial or generic sans-serif.
**Resolution:**
- Check that `@next/font/google` in `src/app/layout.tsx` is importing `Hind_Siliguri` with weights `['300', '400', '500', '600', '700']` and `subsets: ['bengali', 'latin']`.
- Verify the font variable `font-hind-siliguri` is included on the root `<html>` or `<body>` element.

### 1.4. Booking Slot Concurrency Conflict
**Symptoms:** User receives error: *"দুঃখিত, এই সময়টি ইতোমধ্যে বুক করা হয়েছে।"*
**Resolution:**
- This is normal and expected when two users compete for the exact same stylist and minute.
- Have the customer pick an alternative time slot or stylist.

### 1.5. Image Upload Failures (Cloudinary)
**Symptoms:** Image upload returns 400 or fails to save.
**Resolution:**
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set.
- Ensure file size is within limits (default: < 5MB).
