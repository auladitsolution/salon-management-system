import React from "react";
import Link from "next/link";
import { Scissors, MapPin, Phone, Mail, Clock, Heart } from "lucide-react";

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
    <footer className="bg-salon-dark text-white pt-16 pb-8 border-t border-salon-primary/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-salon-primary flex items-center justify-center text-white">
                <Scissors className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight">{salonName}</span>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              আপনার সৌন্দর্য এবং ব্যক্তিত্বকে ফুটিয়ে তুলতে আমরা প্রতিশ্রুতিবদ্ধ। আন্তর্জাতিক মানসম্পন্ন প্রডাক্ট ও অভিজ্ঞ স্টাইলিস্টদের যত্ন।
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-salon-secondary">দ্রুত লিংক</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  হোম
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  সার্ভিস তালিকা
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-white transition-colors">
                  অনলাইন অ্যাপয়েন্টমেন্ট
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-white transition-colors">
                  স্টাইলিস্ট টিম
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-salon-secondary">খোলা থাকার সময়সূচি</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-salon-secondary" />
                <span>সপ্তাহের প্রতিদিন</span>
              </div>
              <p className="text-xs text-gray-400 pl-6">
                সকাল {openingTime} থেকে রাত {closingTime} পর্যন্ত
              </p>
              <p className="text-xs text-salon-secondary/80 pl-6">
                * সরকারি বা বিশেষ ছুটির দিনে সময়সূচি পরিবর্তনশীল
              </p>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-salon-secondary">যোগাযোগের ঠিকানা</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-salon-secondary shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-salon-secondary shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-salon-secondary shrink-0" />
                <span>{email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} {salonName}। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            কারিগরি সহযোগিতায়{" "}
            <span className="font-semibold text-salon-secondary">Aulad IT Solution</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
