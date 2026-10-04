import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-salon-cream">
      <Navbar phone={phone} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h1 className="text-4xl font-extrabold text-salon-dark tracking-tight">
            যোগাযোগ ও অবস্থান
          </h1>
          <p className="text-sm text-salon-muted">
            যেকোনো জিজ্ঞাসা, বুকিং পরামর্শ বা বিশেষ সেবার জন্য সরাসরি যোগাযোগ করুন
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Contact Details Card */}
          <Card className="p-8 space-y-6">
            <h2 className="text-xl font-bold text-salon-dark pb-3 border-b border-salon-primary/10">
              যোগাযোগের মাধ্যম
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-salon-primary-50 text-salon-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-salon-dark">আমাদের ঠিকানা</h4>
                  <p className="text-xs text-salon-muted mt-0.5 leading-relaxed">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-salon-primary-50 text-salon-primary flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-salon-dark">হটলাইন ও ফোন</h4>
                  <p className="text-xs text-salon-muted mt-0.5">{phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-salon-primary-50 text-salon-primary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-salon-dark">ইমেইল ঠিকানা</h4>
                  <p className="text-xs text-salon-muted mt-0.5">{email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-salon-primary-50 text-salon-primary flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-salon-dark">খোলা থাকার সময়সূচি</h4>
                  <p className="text-xs text-salon-muted mt-0.5">সকাল {openingTime} থেকে রাত {closingTime}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-salon-primary/10">
              <a
                href={`https://wa.me/88${phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp এ বার্তা পাঠান</span>
              </a>
            </div>
          </Card>

          {/* Quick Contact Form */}
          <Card className="p-8 space-y-4">
            <h2 className="text-xl font-bold text-salon-dark pb-3 border-b border-salon-primary/10">
              সরাসরি বার্তা পাঠান
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-salon-dark mb-1">আপনার নাম</label>
                <input
                  type="text"
                  placeholder="নাম লিখুন"
                  className="w-full p-2.5 rounded-xl border border-salon-primary/20 text-sm focus:outline-none focus:ring-2 focus:ring-salon-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-salon-dark mb-1">মোবাইল নম্বর</label>
                <input
                  type="tel"
                  placeholder="017XXXXXXXX"
                  className="w-full p-2.5 rounded-xl border border-salon-primary/20 text-sm focus:outline-none focus:ring-2 focus:ring-salon-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-salon-dark mb-1">আপনার বার্তা</label>
                <textarea
                  rows={4}
                  placeholder="আপনার মন্তব্য বা প্রশ্ন এখানে লিখুন..."
                  className="w-full p-2.5 rounded-xl border border-salon-primary/20 text-sm focus:outline-none focus:ring-2 focus:ring-salon-primary"
                />
              </div>
              <button
                type="button"
                className="w-full py-2.5 px-4 rounded-xl bg-salon-primary hover:bg-salon-primary-700 text-white font-semibold text-sm transition-colors"
              >
                বার্তা পাঠান
              </button>
            </form>
          </Card>
        </div>
      </main>

      <Footer phone={phone} email={email} address={address} openingTime={openingTime} closingTime={closingTime} />
    </div>
  );
}
