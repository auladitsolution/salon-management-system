// ==============================================================================
// STANDALONE DEMO SEED SCRIPT (কমান্ড লাইন ডেমো সার্ভিস সিডার)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import path from "path";
import fs from "fs";

// Load .env if process.loadEnvFile is available
try {
  const envPath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envPath) && typeof process.loadEnvFile === "function") {
    process.loadEnvFile(envPath);
  }
} catch (e) {
  console.warn("Notice: .env auto-load note:", e);
}

import { seedDemoServices } from "../src/features/seed/demoData";

async function main() {
  console.log("==================================================================");
  console.log("🌸 Aulad IT Solution - সেলুন ডেমো সার্ভিস ও ডাটা সিডার শুরু হচ্ছে...");
  console.log("==================================================================");
  
  if (!process.env.MONGODB_URI) {
    console.error("❌ ত্রুটি: MONGODB_URI এনভায়রনমেন্ট ভেরিয়েবল পাওয়া যায়নি!");
    process.exit(1);
  }

  try {
    const res = await seedDemoServices();
    console.log("✅ সফলভাবে ডেমো ডাটাবেজ পপুলেট সম্পন্ন হয়েছে:");
    console.log(`   - ক্যাটেগরি সংখ্যা: ${res.categoriesCount}`);
    console.log(`   - সার্ভিস সংখ্যা:   ${res.servicesCount}`);
    console.log(`   - কর্মী (স্টাফ):    ${res.staffCount}`);
    console.log(`   - পিওএস প্রোডাক্টস: ${res.productsCount}`);
    console.log("==================================================================");
    process.exit(0);
  } catch (error) {
    console.error("❌ ডেমো ডাটা সিডিং ব্যর্থ হয়েছে:", error);
    process.exit(1);
  }
}

main();
