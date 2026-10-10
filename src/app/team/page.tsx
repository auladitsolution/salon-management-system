import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { connectToDatabase } from "@/lib/db/connect";
import { Staff } from "@/models/Staff";
import { Sparkles, Calendar, Award, Star } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-mesh-salon antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>প্রফেশনাল বিউটি এক্সপার্টস</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            আমাদের দক্ষ স্টাইলিস্ট টিম
          </h1>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            প্রতিটি স্টাইলিস্ট তাদের নিজ নিজ ক্ষেত্রে বিশেষভাবে অভিজ্ঞ এবং আন্তর্জাতিক মানসম্পন্ন প্রশিক্ষণপ্রাপ্ত।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(staffList.length > 0 ? staffList : [
            { fullName: "রাকিব হাসান", designation: "সিনিয়র হেয়ার স্টাইলিস্ট", specialization: ["হেয়ার কাট", "কালারিং", "স্পা"] },
            { fullName: "আফরিন সুলতানা", designation: "বিউটি ও স্কিন কেয়ার এক্সপার্ট", specialization: ["ফেসিয়াল", "ব্রাইডাল", "স্কিন কেয়ার"] },
            { fullName: "মাহমুদ আলী", designation: "গ্রুমিং ও বিয়ার্ড স্পেশালিস্ট", specialization: ["বিয়ার্ড শেপিং", "হট টাওয়েল শেভ"] },
            { fullName: "শায়লা খানম", designation: "মেকআপ ও নেইল আর্টিস্ট", specialization: ["পার্টি মেকআপ", "ম্যানিকিউর", "পেডিকিউর"] },
          ]).map((staff, idx) => (
            <Card key={idx} hoverEffect className="text-center p-6 border-rose-100 bg-white/95">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-rose-500 via-purple-500 to-amber-400 p-1 shadow-lg shadow-rose-500/20">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-3xl font-black text-salon-primary">
                    {staff.fullName.charAt(0)}
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-xs" />
              </div>

              <h3 className="text-lg font-bold text-slate-900">{staff.fullName}</h3>
              <p className="text-xs text-rose-600 mt-1 font-bold">{staff.designation}</p>

              {staff.specialization && staff.specialization.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-center mt-3.5">
                  {staff.specialization.map((spec, sIdx) => (
                    <span key={sIdx} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-rose-100">
                <Link href="/book">
                  <Button variant="outline" size="sm" className="w-full font-bold">
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
