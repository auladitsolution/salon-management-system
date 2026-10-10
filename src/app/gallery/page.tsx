import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Sparkles, Camera, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function GalleryPage() {
  const galleryItems = [
    { title: "ক্লাসিক হেয়ার কাট ও স্টাইল", category: "হেয়ার স্টাইলিং", gradient: "from-rose-600 via-pink-600 to-amber-500" },
    { title: "প্রিমিয়াম বিয়ার্ড ফেড ও শেভ", category: "গ্রুমিং", gradient: "from-amber-600 via-orange-600 to-rose-600" },
    { title: "ডিপ কন্ডিশনিং হেয়ার স্পা", category: "হেয়ার কেয়ার", gradient: "from-purple-600 via-indigo-600 to-blue-600" },
    { title: "ব্রাইডাল ও সেলিব্রিটি মেকওভার", category: "মেকআপ", gradient: "from-fuchsia-600 via-pink-600 to-rose-500" },
    { title: "হাইড্রেটিং গোল্ড ফেসিয়াল", category: "স্কিন কেয়ার", gradient: "from-emerald-600 via-teal-600 to-cyan-600" },
    { title: "রিল্যাক্সিং বডি ম্যাসাজ ও থেরাপি", category: "স্পা কেয়ার", gradient: "from-blue-600 via-indigo-600 to-purple-600" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-mesh-salon antialiased">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>আমাদের কাজের অ্যালবাম ও পরিবেশ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            ফটোগ্যালারি
          </h1>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            আমাদের স্টাইলিস্টদের নিখুঁত কাজ এবং আধুনিক আরামদায়ক সেলুন পরিবেশের কিছু অসাধারণ মুহূর্ত
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => (
            <Card key={idx} hoverEffect className="overflow-hidden p-0 border-rose-100 bg-white group">
              <div className={`h-60 bg-gradient-to-br ${item.gradient} flex flex-col items-center justify-center text-white relative p-6 text-center shadow-inner`}>
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <span className="text-xs uppercase tracking-widest font-extrabold mt-3 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                  {item.category}
                </span>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                  <span className="text-xs text-rose-600 font-semibold">{item.category}</span>
                </div>
                <Link href="/book">
                  <Button variant="outline" size="sm" className="font-bold">
                    বুক করুন
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
