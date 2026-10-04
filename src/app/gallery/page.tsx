import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Sparkles, Camera } from "lucide-react";

export default function GalleryPage() {
  const galleryItems = [
    { title: "ক্লাসিক হেয়ার কাট ও স্টাইল", category: "হেয়ার স্টাইলিং" },
    { title: "প্রিমিয়াম বিয়ার্ড ফেড", category: "গ্রুমিং" },
    { title: "ডিপ কন্ডিশনিং হেয়ার স্পা", category: "হেয়ার কেয়ার" },
    { title: "ব্রাইডাল মেকওভার", category: "মেকআপ" },
    { title: "হাইড্রেটিং গোল্ড ফেসিয়াল", category: "স্কিন কেয়ার" },
    { title: "রিল্যাক্সিং বডি ম্যাসাজ", category: "স্পা" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-salon-cream">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-primary-100 text-salon-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>আমাদের কাজ ও সেলুন পরিবেশ</span>
          </div>
          <h1 className="text-4xl font-extrabold text-salon-dark tracking-tight">
            ফটোগ্যালারি
          </h1>
          <p className="text-sm text-salon-muted">
            আমাদের স্টাইলিস্টদের নিখুঁত কাজ এবং আধুনিক আরামদায়ক সেলুন পরিবেশের কিছু মুহূর্ত
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, idx) => (
            <Card key={idx} className="overflow-hidden p-0 group hover:shadow-lg transition-all">
              <div className="h-56 bg-gradient-to-br from-salon-primary-700 via-salon-primary to-salon-secondary flex flex-col items-center justify-center text-white relative">
                <Camera className="w-12 h-12 opacity-40 group-hover:scale-110 transition-transform" />
                <span className="text-xs uppercase tracking-wider font-semibold mt-2 opacity-75">
                  {item.category}
                </span>
              </div>
              <div className="p-4 bg-white">
                <h3 className="font-bold text-salon-dark text-base">{item.title}</h3>
                <span className="text-xs text-salon-primary font-medium">{item.category}</span>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
