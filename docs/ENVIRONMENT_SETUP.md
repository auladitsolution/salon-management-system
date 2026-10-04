# Environment Setup Guide
**Salon Booking & Management System - Aulad IT Solution**

## 1. Prerequisites
- Node.js 18.18.0+ or Node.js 20.x/22.x LTS
- npm 9+ or pnpm
- A dedicated MongoDB Atlas Database instance (M0 free tier or M10+ dedicated cluster with replica sets)
- A dedicated Firebase Project with Authentication enabled (Google Sign-In & Email/Password)
- A dedicated Cloudinary account for media assets
- Git version control

---

## 2. Step-by-Step Local Configuration

### Step 2.1: Clone and Prepare Workspace
```bash
git clone <repository_url>
cd salon-booking-management-system
npm install --legacy-peer-deps
```

### Step 2.2: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the variables with your client's dedicated credentials:

```ini
# MongoDB Connection
MONGODB_URI=mongodb+srv://admin:securepass@cluster0.abcde.mongodb.net/client_salon_db?retryWrites=true&w=majority

# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyA...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=client-salon.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=client-salon
NEXT_PUBLIC_FIREBASE_APP_ID=1:...

# Firebase Admin SDK (Private Service Account)
FIREBASE_PROJECT_ID=client-salon
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@client-salon.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=client-salon-cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdef123456789

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_TIMEZONE=Asia/Dhaka
APP_CURRENCY=BDT

# Bootstrap Credentials
BOOTSTRAP_ADMIN_EMAIL=admin@auladit.com
BOOTSTRAP_ADMIN_PHONE=01700000000
BOOTSTRAP_SECRET_KEY=aulad_it_secure_bootstrap_key_2026
CRON_SECRET=salon_cron_token_2026
```

### Step 2.3: Run First-Time Administrator Bootstrap
Start the local development server:
```bash
npm run dev
```

Invoke the bootstrap endpoint:
```bash
curl -X POST http://localhost:3000/api/admin/bootstrap \
  -H "Content-Type: application/json" \
  -d '{"secretKey": "aulad_it_secure_bootstrap_key_2026"}'
```

This initializes:
1. The Owner account (`BOOTSTRAP_ADMIN_EMAIL`).
2. Default business branding and opening hours (`০৯:০০ - ২১:০০`).
3. Core Bengali service categories (হেয়ার কাট, স্টাইলিং, ফেসিয়াল, দাড়ি ট্রিমিং, স্পা).
4. Feature flags and system policies.

---

## 3. Credential Rotation Procedure
If credentials must be rotated:
1. **MongoDB Password:** Update Atlas database user password, update `MONGODB_URI` in Vercel environment variables, and trigger redeploy.
2. **Firebase Private Key:** In Firebase Console > Project Settings > Service Accounts, generate a new private key and delete the old one. Update `FIREBASE_PRIVATE_KEY` on Vercel.
3. **Cloudinary API Secret:** In Cloudinary Dashboard > Settings > Access Keys, generate a new secret and update `CLOUDINARY_API_SECRET`.
