import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { connectToDatabase } from "@/lib/db/connect";
import { Staff } from "@/models/Staff";

export const dynamic = "force-dynamic";

async function getStaffData() {
  try {
    await connectToDatabase();
    return await Staff.find({ isActive: true }).lean();
  } catch (err) {
    console.error("Team page error:", err);
    return [];
  }
}

export default async function TeamPage() {
  const staffList = await getStaffData();

  return (
    <div className="min-h-screen flex flex-col bg-salon-cream">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h1 className="text-4xl font-extrabold text-salon-dark tracking-tight">
            আমাদের দক্ষ স্টাইলিস্ট ও বিউটিশিয়ান
          </h1>
          <p className="text-sm text-salon-muted">
            প্রতিটি স্টাইলিস্ট তাদের নিজ নিজ ক্ষেত্রে বিশেষভাবে অভিজ্ঞ এবং আন্তর্জাতিক মানসম্পন্ন প্রশিক্ষণপ্রাপ্ত
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(staffList.length > 0 ? staffList : [
            { fullName: "রাকিব হাসান", designation: "সিনিয়র হেয়ার স্টাইলিস্ট", specialization: ["হেয়ার কাট", "কালারিং", "স্পা"] },
            { fullName: "আফরিন সুলতানা", designation: "বিউটি ও স্কিন কেয়ার এক্সপার্ট", specialization: ["ফেসিয়াল", "ব্রাইডাল", "স্কিন কেয়ার"] },
            { fullName: "মাহমুদ আলী", designation: "গ্রুমিং ও বিয়ার্ড স্পেশালিস্ট", specialization: ["বিয়ার্ড শেপিং", "হট টাওয়েল শেভ"] },
            { fullName: "শায়লা খানম", designation: "মেকআপ ও নেইল আর্টিস্ট", specialization: ["পার্টি মেকআপ", "ম্যানিকিউর", "পেডিকিউর"] },
          ]).map((staff, idx) => (
            <Card key={idx} className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-24 h-24 mx-auto rounded-full bg-salon-primary-100 flex items-center justify-center text-salon-primary text-3xl font-bold mb-4 border-4 border-white shadow-sm">
                {staff.fullName.charAt(0)}
              </div>
              <h3 className="text-lg font-bold text-salon-dark">{staff.fullName}</h3>
              <p className="text-xs text-salon-muted mt-1 font-medium">{staff.designation}</p>

              {staff.specialization && staff.specialization.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                  {staff.specialization.map((spec, sIdx) => (
                    <span key={sIdx} className="text-[11px] px-2 py-0.5 rounded-full bg-salon-primary-50 text-salon-primary">
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-salon-primary/10">
                <Link href="/book">
                  <Button variant="outline" size="sm" className="w-full">
                    স্লট বুক করুন
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
