import React from "react";
import Link from "next/link";
import { Scissors, MapPin, Phone, Mail, Clock, Heart, Sparkles, ShieldCheck } from "lucide-react";

interface FooterProps {
  salonName?: string;
  phone?: string;
  email?: string;
  address?: string;
  openingTime?: string;
  closingTime?: string;
}

export const Footer: React.FC<FooterProps> = ({
  salonName = "গ্ল্যামার লাউঞ্জ ও সেলুন",
  phone = "01700000000",
  email = "contact@auladit.com",
  address = "রোড ৪/এ, ধানমন্ডি, ঢাকা - ১২০৯",
  openingTime = "০৯:০০",
  closingTime = "২১:০০",
}) => {
  return (
    <footer className="relative bg-slate-950 text-white pt-20 pb-10 border-t border-rose-900/30 mt-auto overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14 border-b border-white/10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/30">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight block leading-tight">{salonName}</span>
                <span className="text-xs text-rose-300 font-semibold tracking-wide">Aulad IT Solution</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              আপনার সৌন্দর্য, ব্যক্তিত্ব ও আত্মবিশ্বাস বৃদ্ধি করতে আমাদের প্রিমিয়াম সেবা। অভিজ্ঞ স্টাইলিস্টদের যত্ন ও আধুনিক নিরাপদ সরঞ্জাম।
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>১০০% প্রফেশনাল কেয়ার</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>দ্রুত লিঙ্ক</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <span className="text-rose-500 text-xs">▸</span> হোম
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <span className="text-rose-500 text-xs">▸</span> সকল সার্ভিস ও প্যাকেজ
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <span className="text-rose-500 text-xs">▸</span> অনলাইন অ্যাপয়েন্টমেন্ট
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <span className="text-rose-500 text-xs">▸</span> আমাদের স্টাইলিস্ট টিম
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-rose-300 transition-colors flex items-center gap-2">
                  <span className="text-rose-500 text-xs">▸</span> গ্যালারি
                </Link>
              </li>
            </ul>
          </div>

          {/* Opening Schedule */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>খোলা থাকার সময়</span>
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>সপ্তাহের প্রতিদিন খোলা</span>
                </div>
                <p className="text-xs text-amber-300/90 pl-6">
                  সকাল {openingTime} — রাত {closingTime}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>অনলাইন স্লট বুকিং ২৪/৭ খোলা থাকে</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              <span>যোগাযোগ ও অবস্থান</span>
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="leading-snug">{address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <a href={`tel:${phone}`} className="hover:text-emerald-300 transition-colors font-semibold">
                  {phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <a href={`mailto:${email}`} className="hover:text-rose-300 transition-colors">
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} {salonName}। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-2">
            <span>ডিজাইন ও ডেভেলপমেন্ট:</span>
            <span className="font-bold text-gradient-gold">Aulad IT Solution</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
