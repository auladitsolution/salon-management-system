import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Scissors, Clock, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { connectToDatabase } from "@/lib/db/connect";
import { Service } from "@/models/Service";
import { ServiceCategory } from "@/models/ServiceCategory";
import { formatBengaliCurrency, toBengaliNumerals } from "@/lib/money/poisha";

export const dynamic = "force-dynamic";

async function getServicesData() {
  try {
    await connectToDatabase();
    const categories = await ServiceCategory.find({ isActive: true }).sort({ orderIndex: 1 }).lean();
    const services = await Service.find({ isActive: true }).populate("categoryId", "name slug").lean();
    return { categories, services };
  } catch (err) {
    console.error("Services page fetch error:", err);
    return { categories: [], services: [] };
  }
}

export default async function ServicesPage() {
  const { categories, services } = await getServicesData();

  const categoryPalettes = [
    { badge: "bg-rose-100 text-rose-700 border-rose-200", icon: "from-rose-500 to-pink-600" },
    { badge: "bg-amber-100 text-amber-700 border-amber-200", icon: "from-amber-500 to-orange-500" },
    { badge: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: "from-emerald-500 to-teal-600" },
    { badge: "bg-purple-100 text-purple-700 border-purple-200", icon: "from-purple-500 to-indigo-600" },
    { badge: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200", icon: "from-fuchsia-500 to-pink-600" },
    { badge: "bg-sky-100 text-sky-700 border-sky-200", icon: "from-sky-500 to-cyan-600" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-mesh-salon antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>প্রিমিয়াম সেলুন মেনু ও ট্যারিফ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            আমাদের সকল সার্ভিস ও প্রাইসিং
          </h1>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            আন্তর্জাতিক মানের স্কিন, হেয়ার এবং গ্রুমিং কেয়ার। প্রতিটি সার্ভিসের সাথে উপভোগ করুন সর্বোচ্চ পরিচ্ছন্নতা ও আরামদায়ক পরিবেশ।
          </p>
        </div>

        {categories.map((cat, catIdx) => {
          const categoryServices = services.filter(
            (s) => (s.categoryId as unknown as { _id?: string })?._id?.toString() === cat._id.toString()
          );

          if (categoryServices.length === 0) return null;
          const palette = categoryPalettes[catIdx % categoryPalettes.length];

          return (
            <div key={cat._id.toString()} className="mb-16">
              <div className="flex items-center gap-3.5 mb-8 pb-3 border-b border-rose-100">
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${palette.icon} text-white flex items-center justify-center shadow-md`}>
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{cat.name}</h2>
                  <p className="text-xs text-slate-500">{cat.description || "আন্তর্জাতিক মানসম্পন্ন প্রফেশনাল যত্ন"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service) => (
                  <Card key={service._id.toString()} hoverEffect className="flex flex-col justify-between border-rose-100 bg-white/90">
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                          ⏱ {toBengaliNumerals(service.durationMinutes)} মিনিট
                        </span>
                        <span className="text-xl font-black text-gradient-primary">
                          {formatBengaliCurrency(service.priceMinor)}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">{service.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-rose-100 mt-6 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-rose-500" /> {toBengaliNumerals(service.durationMinutes)} মি.
                      </span>
                      <Link href={`/book?serviceId=${service._id.toString()}`}>
                        <Button variant="primary" size="sm" className="font-bold shadow-glow">
                          <span>বুকিং নিন</span>
                          <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      <Footer />
    </div>
  );
}
