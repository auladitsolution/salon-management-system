import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Scissors,
  Sparkles,
  Calendar,
  Clock,
  Star,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  Award,
  ArrowRight,
  Zap,
  Flame,
  Crown,
} from "lucide-react";
import { connectToDatabase } from "@/lib/db/connect";
import { BusinessSettings } from "@/models/BusinessSettings";
import { ServiceCategory } from "@/models/ServiceCategory";
import { Service } from "@/models/Service";
import { Staff } from "@/models/Staff";
import { formatBengaliCurrency, toBengaliNumerals } from "@/lib/money/poisha";

export const dynamic = "force-dynamic";

async function getInitialData() {
  try {
    await connectToDatabase();
    const settings = await BusinessSettings.findOne().lean();
    const categories = await ServiceCategory.find({ isActive: true }).sort({ orderIndex: 1 }).lean();
    const featuredServices = await Service.find({ isActive: true }).limit(6).lean();
    const staffList = await Staff.find({ isActive: true }).limit(4).lean();

    return {
      settings: settings || {
        salonName: "প্রিমিয়াম গ্ল্যামার সেলুন",
        tagline: "আপনার সৌন্দর্য, আমাদের শৈল্পিক যত্ন",
        phone: "01700000000",
        email: "contact@auladit.com",
        address: "রোড ৪/এ, ধানমন্ডি, ঢাকা - ১২০৯",
        openingTime: "০৯:০০",
        closingTime: "২১:০০",
      },
      categories,
      featuredServices,
      staffList,
    };
  } catch (err) {
    console.error("Home page DB fetch error:", err);
    return {
      settings: {
        salonName: "প্রিমিয়াম গ্ল্যামার সেলুন",
        tagline: "আপনার সৌন্দর্য, আমাদের শৈল্পিক যত্ন",
        phone: "01700000000",
        email: "contact@auladit.com",
        address: "রোড ৪/এ, ধানমন্ডি, ঢাকা - ১২০৯",
        openingTime: "০৯:০০",
        closingTime: "২১:০০",
      },
      categories: [],
      featuredServices: [],
      staffList: [],
    };
  }
}

export default async function HomePage() {
  const { settings, categories, featuredServices, staffList } = await getInitialData();

  // Category visual presets with unique vibrant colors
  const categoryThemes = [
    { bg: "from-rose-500 to-pink-600", light: "bg-rose-50 text-rose-700 border-rose-200" },
    { bg: "from-amber-500 to-orange-500", light: "bg-amber-50 text-amber-700 border-amber-200" },
    { bg: "from-emerald-500 to-teal-600", light: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { bg: "from-purple-500 to-indigo-600", light: "bg-purple-50 text-purple-700 border-purple-200" },
    { bg: "from-fuchsia-500 to-rose-600", light: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200" },
    { bg: "from-sky-500 to-cyan-600", light: "bg-sky-50 text-sky-700 border-sky-200" },
  ];

  const displayCategories = categories.length > 0 ? categories : [
    { name: "হেয়ার কাট ও স্টাইলিং", slug: "hair-cut", description: "ট্রেন্ডি আন্তর্জাতিক হেয়ারকাট ও প্রফেশনাল হেয়ার সেটিং" },
    { name: "দাড়ি ও স্পেশাল গ্রুমিং", slug: "beard-grooming", description: "দাড়ি ট্রিমিং, সেভিং ও লাক্সারি বিয়ার্ড স্পা" },
    { name: "ফেসিয়াল ও স্কিন কেয়ার", slug: "facial-skin", description: "হাইড্রেটিং গ্লো ফেসিয়াল ও হারবাল অ্যান্টি-অ্যাজিং থেরাপি" },
    { name: "হেয়ার কালার ও স্পা", slug: "hair-color-spa", description: "প্রিমিয়াম অ্যামোনিয়া-মুক্ত গ্লোবাল কালার ও ডিপ কন্ডিশনিং" },
    { name: "ব্রাইডাল ও মেকআপ", slug: "bridal-makeup", description: "ওয়েডিং ও সেলিব্রিটি এক্সক্লুসিভ গ্ল্যামারাস মেকওভার" },
    { name: "ম্যানিকিউর ও পেডিকিউর", slug: "mani-pedi", description: "হাত ও পায়ের এক্সফোলিয়েটিং যত্ন ও ফুট স্পা" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-mesh-salon antialiased">
      <Navbar salonName={settings.salonName} phone={settings.phone} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
        {/* Colorful Blurred Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-r from-rose-400/20 via-purple-400/20 to-amber-300/20 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-fuchsia-400/15 blur-2xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-100/90 via-purple-100/90 to-amber-100/90 border border-rose-200/60 shadow-sm">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                </span>
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span className="text-xs font-bold text-slate-800 tracking-wide">
                  ঢাকা শহরের সেরা বিলাসবহুল সেলুন ও পার্লার
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                নিজেকে সাজিয়ে তুলুন{" "}
                <span className="text-gradient-primary">অনন্য ও আকর্ষণীয়</span>{" "}
                রূপে
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                আন্তর্জাতিক সার্টিফাইড হেয়ার স্টাইলিস্ট এবং প্রিমিয়াম প্রডাক্টের নিখুঁত ছোঁয়ায় পান রাজকীয় অভিজ্ঞতা। অনলাইন বুকিং দিয়ে সিরিয়ালের ঝামেলা এড়ান।
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/book" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto gap-3 text-base shadow-glow">
                    <Calendar className="w-5 h-5" />
                    <span>অ্যাপয়েন্টমেন্ট বুক করুন</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                <Link href="/services" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2.5 text-base">
                    <Scissors className="w-5 h-5 text-salon-primary" />
                    <span>সার্ভিস তালিকা দেখুন</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-rose-200/60 max-w-lg mx-auto lg:mx-0">
                <div className="flex flex-col items-center lg:items-start p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-rose-100">
                  <span className="text-2xl font-black text-gradient-primary">১০০%</span>
                  <span className="text-xs text-slate-600 font-semibold mt-0.5">জীবাণুমুক্ত সরঞ্জাম</span>
                </div>
                <div className="flex flex-col items-center lg:items-start p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-rose-100">
                  <span className="text-2xl font-black text-gradient-gold">১৫+</span>
                  <span className="text-xs text-slate-600 font-semibold mt-0.5">এক্সপার্ট স্টাইলিস্ট</span>
                </div>
                <div className="flex flex-col items-center lg:items-start p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-rose-100">
                  <span className="text-2xl font-black text-emerald-600">৫,০০০+</span>
                  <span className="text-xs text-slate-600 font-semibold mt-0.5">সন্তুষ্ট নিয়মিত গ্রাহক</span>
                </div>
              </div>
            </div>

            {/* Right Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                
                {/* Glow Backdrop */}
                <div className="absolute -inset-2 bg-gradient-to-r from-rose-500 via-purple-600 to-amber-500 rounded-3xl blur-xl opacity-40 animate-pulse-slow" />

                {/* Main Showcase Panel */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/60 bg-gradient-to-br from-slate-900 via-salon-primary-900 to-purple-950 p-8 text-white">
                  <div className="absolute -top-10 -right-10 w-44 h-44 bg-rose-500/20 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-amber-500/20 rounded-full blur-2xl" />

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Crown className="w-8 h-8 text-slate-950" />
                      </div>
                      <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/20">
                        ভিআইপি এক্সপেরিয়েন্স
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-black tracking-tight">{settings.salonName}</h3>
                      <p className="text-xs text-rose-200 mt-1">প্রিমিয়াম লাউঞ্জ, এসি পরিবেশ ও আরামদায়ক সেবা</p>
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-3 text-sm bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/10">
                        <div className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="font-medium text-slate-100">সার্টিফাইড এক্সপার্ট বিউটিশিয়ান</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/10">
                        <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0">
                          <Clock className="w-4 h-4 text-amber-300" />
                        </div>
                        <span className="font-medium text-slate-100">
                          সকাল {settings.openingTime} হতে রাত {settings.closingTime} পর্যন্ত
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sm bg-white/10 p-3.5 rounded-2xl backdrop-blur-md border border-white/10">
                        <div className="w-6 h-6 rounded-full bg-rose-400/20 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4 text-rose-300" />
                        </div>
                        <span className="font-medium text-slate-100">সম্পূর্ণ সুরক্ষিত ও প্রিমিয়াম প্রডাক্টস</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href="/book" className="block">
                        <Button variant="gold" size="lg" className="w-full">
                          অনলাইন স্লট বুক করুন
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating Rating Card */}
                <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-rose-100 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                    <Star className="w-6 h-6 fill-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-900 text-base">৪.৯</span>
                      <span className="text-xs text-slate-500 font-semibold">(৩৫০+ রিভিউ)</span>
                    </div>
                    <span className="text-xs text-rose-600 font-bold block">গ্রাহক সন্তুষ্টি স্কোর</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-20 bg-white/70 backdrop-blur-md border-y border-rose-100/70 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>এক্সক্লুসিভ ক্যাটেগরি</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              আমাদের সার্ভিস ক্যাটেগরিসমূহ
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              আপনার পছন্দের সেবা বেছে নিন এবং দক্ষ স্পেশালিস্টদের সাথে সরাসরি বুকিং নিশ্চিত করুন
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map((cat, idx) => {
              const theme = categoryThemes[idx % categoryThemes.length];
              return (
                <Card key={idx} hoverEffect className="group border-rose-100/80 hover:border-rose-300">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${theme.bg} text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Scissors className="w-7 h-7" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-salon-primary transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {cat.description || "সেরা যত্ন ও আধুনিক অভিজ্ঞতার সাথে প্রফেশনাল সেবা"}
                      </p>
                      <div className="pt-2">
                        <Link href="/book" className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors">
                          <span>বুকিং শুরু করুন</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-20 bg-mesh-salon relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
                <Flame className="w-3.5 h-3.5 text-amber-600" />
                <span>টপ ট্রেন্ডিং প্যাকেজ</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                জনপ্রিয় সার্ভিসসমূহ
              </h2>
              <p className="text-sm text-slate-600 mt-1">সবচেয়ে বেশি বুক করা এক্সক্লুসিভ সেবা ও স্পেশাল কেয়ার</p>
            </div>
            <Link href="/services">
              <Button variant="outline" size="sm" className="gap-2 font-bold">
                <span>সকল সার্ভিস দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(featuredServices.length > 0 ? featuredServices : [
              { _id: "s1", name: "সিগনেচার হেয়ার কাট ও ওয়াশ", priceMinor: 45000, durationMinutes: 35, description: "কনসালটেশন, প্রিমিয়াম হেয়ার স্পা ওয়াশ এবং ট্রেন্ডি আন্তর্জাতিক কাটিং" },
              { _id: "s2", name: "হাইড্রেটিং গোল্ড গ্লো ফেসিয়াল", priceMinor: 120000, durationMinutes: 60, description: "ডিপ ক্লিনজিং, স্ক্রাবিং, ফেস প্যাক, স্কিন টোনার ও রিফ্রেশিং ম্যাসাজ" },
              { _id: "s3", name: "প্রিমিয়াম বিয়ার্ড ও হট টাওয়েল গ্রুমিং", priceMinor: 35000, durationMinutes: 25, description: "দাড়ি কাটিং, শেপিং, হট টাওয়েল স্টিম ও অর্গানিক বিয়ার্ড অয়েল থেরাপি" },
            ]).map((service, idx) => (
              <Card key={idx} hoverEffect className="flex flex-col justify-between border-rose-100/80 bg-white/90">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80">
                      ⏱ {toBengaliNumerals(service.durationMinutes)} মিনিট
                    </span>
                    <span className="text-xl font-black text-gradient-primary">
                      {formatBengaliCurrency(service.priceMinor)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">{service.name}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-rose-100 mt-6 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-500" /> আনুমানিক {toBengaliNumerals(service.durationMinutes)} মি.
                  </span>
                  <Link href={`/book?serviceId=${service._id}`}>
                    <Button variant="primary" size="sm" className="font-bold">
                      অ্যাপয়েন্টমেন্ট নিন
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stylist Team Showcase */}
      <section className="py-20 bg-white/80 backdrop-blur-md border-t border-rose-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>দক্ষ প্রফেশনালস</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              আমাদের এক্সপার্ট স্টাইলিস্ট টিম
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              আপনার পছন্দের স্পেশালিস্টের সাথে নির্দিষ্ট সময়ে সেবা গ্রহণের প্রিমিয়াম অভিজ্ঞতা
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(staffList.length > 0 ? staffList : [
              { fullName: "রাকিব হাসান", designation: "সিনিয়র হেয়ার স্টাইলিস্ট", specialization: ["হেয়ার কাট", "কালারিং"] },
              { fullName: "আফরিন সুলতানা", designation: "বিউটি ও স্কিন কেয়ার এক্সপার্ট", specialization: ["ফেসিয়াল", "ব্রাইডাল"] },
              { fullName: "মাহমুদ আলী", designation: "গ্রুমিং ও বিয়ার্ড স্পেশালিস্ট", specialization: ["বিয়ার্ড শেপিং"] },
              { fullName: "শায়লা খানম", designation: "মেকআপ ও নেইল আর্টিস্ট", specialization: ["পার্টি মেকআপ"] },
            ]).map((staff, idx) => (
              <Card key={idx} hoverEffect className="text-center p-6 border-rose-100/80 bg-white/90">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-full h-full rounded-full bg-gradient-to-tr from-rose-500 via-purple-500 to-amber-400 p-1 shadow-lg shadow-rose-500/20">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-2xl font-black text-salon-primary">
                      {staff.fullName.charAt(0)}
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                </div>

                <h3 className="text-base font-bold text-slate-900">{staff.fullName}</h3>
                <p className="text-xs text-rose-600 mt-0.5 font-bold">{staff.designation}</p>

                <div className="mt-5 pt-4 border-t border-rose-100">
                  <Link href="/book">
                    <Button variant="outline" size="sm" className="w-full font-bold">
                      স্লট বুক করুন
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-20 bg-mesh-salon border-t border-rose-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              গ্রাহকদের আস্থা ও অভিজ্ঞতা
            </h2>
            <p className="text-sm text-slate-600">আমাদের মানসম্মত সেবা সম্পর্কে মূল্যবান কাস্টমার ফিডব্যাক</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "তানভীর আহমেদ",
                rating: 5,
                comment: "অনলাইনে অ্যাপয়েন্টমেন্ট বুকিং করে নির্দিষ্ট সময়ে সেবা পাওয়ার অভিজ্ঞতা অসাধারণ ছিল। বিন্দুমাত্র অপেক্ষা করতে হয়নি!",
                service: "সিগনেচার হেয়ার কাট",
              },
              {
                name: "নুসরাত জাহান",
                rating: 5,
                comment: "ফেসিয়াল এবং হেয়ার স্পার যত্ন দারুণ লেগেছে। সম্পূর্ণ হাইজিনিক পরিবেশ এবং কর্মীরা অত্যন্ত বিনয়ী ও দক্ষ।",
                service: "গোল্ড গ্লো ফেসিয়াল",
              },
              {
                name: "শাহরিয়ার কবির",
                rating: 5,
                comment: "বিয়ার্ড ট্রিম এবং গ্রুমিং এর ফিনিশিং ছিল ১০০% নিখুঁত। নিয়মিত গ্রুমিংয়ের জন্য অত্যন্ত বিশ্বস্ত সেলুন।",
                service: "লাক্সারি বিয়ার্ড গ্রুমিং",
              },
            ].map((rev, idx) => (
              <Card key={idx} hoverEffect className="p-6 bg-white border-rose-100/80 space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="pt-3 border-t border-rose-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{rev.name}</span>
                  <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200/60">
                    {rev.service}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Radiant Call to Action Banner */}
      <section className="relative py-20 bg-gradient-to-r from-slate-950 via-salon-primary-900 to-purple-950 text-white overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>কোনো অগ্রিম পেমেন্টের ঝামেলা নেই</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            আজই আপনার পছন্দের সময়ে স্লট কনফার্ম করুন
          </h2>

          <p className="text-base sm:text-lg text-slate-200 max-w-xl mx-auto font-normal">
            মাত্র ২ মিনিটে আপনার প্রয়োজনীয় সার্ভিস ও পছন্দের স্টাইলিস্ট বেছে নিয়ে ঝামেলামুক্ত অভিজ্ঞতা উপভোগ করুন।
          </p>

          <div className="pt-2">
            <Link href="/book">
              <Button variant="gold" size="lg" className="font-extrabold text-base px-9 py-4 shadow-glow-gold">
                <span>এখনই বুকিং করুন</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer
        salonName={settings.salonName}
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
        openingTime={settings.openingTime}
        closingTime={settings.closingTime}
      />
    </div>
  );
}
