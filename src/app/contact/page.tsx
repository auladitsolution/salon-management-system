import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Phone, Mail, Clock, MessageSquare, Sparkles, Send } from "lucide-react";
import { connectToDatabase } from "@/lib/db/connect";
import { BusinessSettings } from "@/models/BusinessSettings";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  let settings = null;
  try {
    await connectToDatabase();
    settings = await BusinessSettings.findOne().lean();
  } catch (err) {
    console.warn("Contact page using default fallback settings:", err);
  }

  const phone = settings?.phone || "01700000000";
  const email = settings?.email || "contact@auladit.com";
  const address = settings?.address || "রোড ৪/এ, ধানমন্ডি, ঢাকা - ১২০৯";
  const openingTime = settings?.openingTime || "০৯:০০";
  const closingTime = settings?.closingTime || "২১:০০";

  return (
    <div className="min-h-screen flex flex-col bg-mesh-salon antialiased">
      <Navbar phone={phone} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>সরাসরি যোগাযোগ ও পরামর্শ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
            যোগাযোগ ও অবস্থান
          </h1>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            যেকোনো জিজ্ঞাসা, বুকিং সহায়তা বা বিশেষ ইভেন্ট বুকিংয়ের জন্য আমাদের সাথে যোগাযোগ করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100/80 shadow-xl space-y-6">
            <h2 className="text-xl font-black text-slate-900 pb-3 border-b border-rose-100">
              যোগাযোগের মাধ্যম
            </h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">আমাদের সেলুনের অবস্থান</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">হটলাইন ও ফোন</h4>
                  <a href={`tel:${phone}`} className="text-xs font-bold text-rose-600 hover:underline mt-1 block">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">ইমেইল ঠিকানা</h4>
                  <a href={`mailto:${email}`} className="text-xs text-slate-600 hover:text-rose-600 mt-1 block font-medium">
                    {email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">খোলা থাকার সময়সূচি</h4>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    সকাল {openingTime} থেকে রাত {closingTime} (সপ্তাহের ৭ দিন খোলা)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Inquiry Form */}
          <div className="p-8 rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100/80 shadow-xl space-y-4">
            <h2 className="text-xl font-black text-slate-900 pb-3 border-b border-rose-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-600" />
              <span>বার্তা পাঠান</span>
            </h2>

            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">আপনার নাম</label>
                <input
                  type="text"
                  placeholder="আপনার পূর্ণ নাম"
                  className="w-full px-4 py-2.5 rounded-2xl border border-rose-200/80 text-sm focus:outline-none focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">মোবাইল নম্বর</label>
                <input
                  type="text"
                  placeholder="017XXXXXXXX"
                  className="w-full px-4 py-2.5 rounded-2xl border border-rose-200/80 text-sm focus:outline-none focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">আপনার বার্তা বা জিজ্ঞাসা</label>
                <textarea
                  rows={4}
                  placeholder="আপনার বার্তা এখানে লিখুন..."
                  className="w-full p-4 rounded-2xl border border-rose-200/80 text-sm focus:outline-none focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500"
                />
              </div>

              <Button variant="primary" size="md" className="w-full gap-2 font-bold shadow-glow">
                <Send className="w-4 h-4" />
                <span>বার্তা পাঠান</span>
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
