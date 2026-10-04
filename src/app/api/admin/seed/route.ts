import { NextRequest, NextResponse } from "next/server";
import { seedDemoServices } from "@/features/seed/demoData";

export async function POST(req: NextRequest) {
  try {
    const result = await seedDemoServices();
    return NextResponse.json({
      success: true,
      message: `ডেমো ডাটা সফলভাবে তৈরি করা হয়েছে! (${result.servicesCount}টি সার্ভিস, ${result.categoriesCount}টি ক্যাটেগরি, ${result.staffCount} জন স্টাফ, ${result.productsCount}টি প্রোডাক্ট)`,
      data: result,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Seed error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "ডেমো ডাটা তৈরিতে ত্রুটি ঘটেছে",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
