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
} from "lucide-react";
import { connectToDatabase } from "@/lib/db/connect";
import { BusinessSettings } from "@/models/BusinessSettings";
import { ServiceCategory } from "@/models/ServiceCategory";
import { Service } from "@/models/Service";
import { Staff } from "@/models/Staff";
import { formatBengaliCurrency } from "@/lib/money/poisha";
import { toBengaliNumerals } from "@/lib/money/poisha";

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
        salonName: "প্রিমিয়াম সেলুন",
        tagline: "আপনার সৌন্দর্য, আমাদের যত্ন",
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
        salonName: "প্রিমিয়াম সেলুন",
        tagline: "আপনার সৌন্দর্য, আমাদের যত্ন",
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

  // Fallback categories if empty
  const displayCategories = categories.length > 0 ? categories : [
    { name: "হেয়ার কাট ও স্টাইলিং", slug: "hair-cut", description: "ট্রেন্ডি হেয়ারকাট ও প্রফেশনাল হেয়ার সেটিং" },
    { name: "দাড়ি ও স্পেশাল গ্রুমিং", slug: "beard-grooming", description: "দাড়ি ট্রিমিং, সেভিং ও বিয়ার্ড স্পা" },
    { name: "ফেসিয়াল ও স্কিন কেয়ার", slug: "facial-skin", description: "গ্লোয়িং ফেসিয়াল ও হারবাল থেরাপি" },
    { name: "হেয়ার কালার ও স্পা", slug: "hair-color-spa", description: "প্রিমিয়াম অ্যামোনিয়া-মুক্ত কালার ও ডিপ কন্ডিশনিং" },
    { name: "ব্রাইডাল ও মেকআপ", slug: "bridal-makeup", description: "ওয়েডিং ও পার্টি এক্সক্লুসিভ মেকওভার" },
    { name: "ম্যানিকিউর ও পেডিকিউর", slug: "mani-pedi", description: "হাত ও পায়ের যত্ন ও স্পেশাল স্ক্রাবিং" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-salon-cream">
      <Navbar salonName={settings.salonName} phone={settings.phone} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="absolute inset-0 bg-gradient-to-b from-salon-primary-50/60 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-salon-primary-100 text-salon-primary text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                <span>প্রিমিয়াম গ্রুমিং ও বিউটি কেয়ার</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-salon-dark tracking-tight leading-[1.2]">
                {settings.tagline || "আপনার সৌন্দর্য, আমাদের যত্ন"}
              </h1>

              <p className="text-base sm:text-lg text-salon-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                অভিজ্ঞ হেয়ার স্টাইলিস্ট এবং প্রিমিয়াম প্রোডাক্টের স্পর্শে নিজেকে সাজিয়ে তুলুন আকর্ষণীয় রূপে। অনলাইন অ্যাপয়েন্টমেন্ট নিয়ে লাইনে দাঁড়ানোর ঝামেলা এড়ান।
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/book" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2.5 text-base">
                    <Calendar className="w-5 h-5" />
                    <span>এখনই অ্যাপয়েন্টমেন্ট নিন</span>
                  </Button>
                </Link>

                <Link href="/services" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-base">
                    <Scissors className="w-5 h-5" />
                    <span>আমাদের সার্ভিস দেখুন</span>
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-salon-primary/10 max-w-lg mx-auto lg:mx-0">
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-xl font-bold text-salon-primary">১০০%</span>
                  <span className="text-xs text-salon-muted font-medium">নিরাপদ ও স্বাস্থ্যকর</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-xl font-bold text-salon-primary">১৫+</span>
                  <span className="text-xs text-salon-muted font-medium">অভিজ্ঞ স্টাইলিস্ট</span>
                </div>
                <div className="flex flex-col items-center lg:items-start">
                  <span className="text-xl font-bold text-salon-primary">৫,০০০+</span>
                  <span className="text-xs text-salon-muted font-medium">সন্তুষ্ট গ্রাহক</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-tr from-salon-primary-700 to-salon-primary p-8 text-white relative">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Scissors className="w-48 h-48 -rotate-45" />
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Award className="w-8 h-8 text-salon-secondary" />
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold">{settings.salonName}</h3>
                      <p className="text-sm text-gray-200 mt-1">ঢাকা সিটির সেরা আধুনিক গ্রুমিং স্যালুন</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3 text-sm bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>সার্টিফাইড এক্সপার্ট বিউটিশিয়ান</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                        <Clock className="w-5 h-5 text-salon-secondary shrink-0" />
                        <span>সকাল {settings.openingTime} - রাত {settings.closingTime} খোলা</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                        <ShieldCheck className="w-5 h-5 text-amber-300 shrink-0" />
                        <span>১০০% জীবাণুমুক্ত আধুনিক সরঞ্জাম</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link href="/book" className="block">
                        <Button variant="secondary" size="md" className="w-full font-bold">
                          অনলাইন স্লট বুক করুন
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating Rating Pill */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-salon-primary/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                    <Star className="w-5 h-5 fill-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-salon-dark">৪.৯</span>
                      <span className="text-xs text-salon-muted">(৩৫০+ রিভিউ)</span>
                    </div>
                    <span className="text-xs text-salon-primary font-medium">গ্রাহক সন্তুষ্টি রেটিং</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-16 bg-white border-y border-salon-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-salon-dark">আমাদের সার্ভিস ক্যাটেগরিসমূহ</h2>
            <p className="text-sm text-salon-muted">
              আপনার প্রয়োজনীয় সেবা বেছে নিন এবং সহজে বুকিং সম্পন্ন করুন
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCategories.map((cat, idx) => (
              <Card key={idx} className="hover:border-salon-primary/30 hover:shadow-md transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-salon-primary-50 text-salon-primary flex items-center justify-center shrink-0 group-hover:bg-salon-primary group-hover:text-white transition-colors">
                    <Scissors className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-salon-dark group-hover:text-salon-primary transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-salon-muted leading-relaxed">
                      {cat.description || "সেরা যত্ন ও আধুনিক অভিজ্ঞতার সাথে প্রফেশনাল সেবা"}
                    </p>
                    <div className="pt-2">
                      <Link href="/book" className="text-xs font-semibold text-salon-primary hover:underline">
                        বুকিং করুন →
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="py-16 bg-salon-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-salon-dark">জনপ্রিয় সার্ভিসসমূহ</h2>
              <p className="text-sm text-salon-muted mt-1">সবচেয়ে বেশি বুক করা এক্সক্লুসিভ সার্ভিস প্যাকেজ</p>
            </div>
            <Link href="/services">
              <Button variant="outline" size="sm">
                সকল সার্ভিস দেখুন
              </Button>
            </Link>
          </div>

          {featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map((service, idx) => (
                <Card key={idx} className="flex flex-col justify-between hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-salon-primary-100 text-salon-primary">
                        {toBengaliNumerals(service.durationMinutes)} মিনিট
                      </span>
                      <span className="text-lg font-bold text-salon-primary">
                        {formatBengaliCurrency(service.priceMinor)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-salon-dark">{service.name}</h3>
                    <p className="text-xs text-salon-muted line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-salon-primary/10 mt-6 flex items-center justify-between">
                    <span className="text-xs text-salon-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> আনুমানিক {toBengaliNumerals(service.durationMinutes)} মি.
                    </span>
                    <Link href={`/book?serviceId=${service._id}`}>
                      <Button size="sm">অ্যাপয়েন্টমেন্ট নিন</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "সিগনেচার হেয়ার কাট ও ওয়াশ", price: 45000, duration: 35, desc: "কনসালটেশন, হেয়ার স্পা ওয়াশ এবং ট্রেন্ডি কাটিং" },
                { name: "হাইড্রেটিং গ্লো ফেসিয়াল", price: 120000, duration: 60, desc: "ডিপ ক্লিনজিং, স্ক্রাবিং, ফেস প্যাক ও ময়েশ্চারাইজার" },
                { name: "প্রিমিয়াম বিয়ার্ড গ্রুমিং", price: 35000, duration: 25, desc: "দাড়ি কাটিং, শেপিং, হট টাওয়েল ও বিয়ার্ড অয়েল থেরাপি" },
              ].map((sample, idx) => (
                <Card key={idx} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-salon-primary-100 text-salon-primary">
                        {toBengaliNumerals(sample.duration)} মিনিট
                      </span>
                      <span className="text-lg font-bold text-salon-primary">
                        {formatBengaliCurrency(sample.price)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-salon-dark">{sample.name}</h3>
                    <p className="text-xs text-salon-muted leading-relaxed">{sample.desc}</p>
                  </div>
                  <div className="pt-6 border-t border-salon-primary/10 mt-6 flex items-center justify-between">
                    <span className="text-xs text-salon-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> আনুমানিক {toBengaliNumerals(sample.duration)} মি.
                    </span>
                    <Link href="/book">
                      <Button size="sm">বুকিং করুন</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stylist Team Showcase */}
      <section className="py-16 bg-white border-t border-salon-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-salon-dark">আমাদের দক্ষ স্টাইলিস্ট টিম</h2>
            <p className="text-sm text-salon-muted">
              আপনার পছন্দের স্টাইলিস্টের সাথে নির্দিষ্ট সময়ে সেবা গ্রহণের সুযোগ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(staffList.length > 0 ? staffList : [
              { fullName: "রাকিব হাসান", designation: "সিনিয়র হেয়ার স্টাইলিস্ট" },
              { fullName: "আফরিন সুলতানা", designation: "বিউটি ও স্কিন কেয়ার এক্সপার্ট" },
              { fullName: "মাহমুদ আলী", designation: "গ্রুমিং ও বিয়ার্ড স্পেশালিস্ট" },
              { fullName: "শায়লা খানম", designation: "মেকআপ ও ব্রাইডাল আর্টিস্ট" },
            ]).map((staff, idx) => (
              <Card key={idx} className="text-center p-6 hover:shadow-lg transition-shadow">
                <div className="w-20 h-20 mx-auto rounded-full bg-salon-primary-100 flex items-center justify-center text-salon-primary text-2xl font-bold mb-4 border-2 border-salon-primary/20">
                  {staff.fullName.charAt(0)}
                </div>
                <h3 className="text-base font-bold text-salon-dark">{staff.fullName}</h3>
                <p className="text-xs text-salon-muted mt-1">{staff.designation}</p>
                <div className="mt-4 pt-4 border-t border-salon-primary/10">
                  <Link href="/book">
                    <Button variant="outline" size="sm" className="w-full">
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
      <section className="py-16 bg-salon-cream border-t border-salon-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="text-3xl font-extrabold text-salon-dark">গ্রাহকদের অভিজ্ঞতা ও মতামত</h2>
            <p className="text-sm text-salon-muted">আমাদের সেবা সম্পর্কে গ্রাহকদের মূল্যবান অভিজ্ঞতা</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "তানভীর আহমেদ",
                rating: 5,
                comment: "অনলাইনে বুকিং করে নির্দিষ্ট সময়ে সেবা পাওয়ার অভিজ্ঞতা অসাধারণ ছিল। একদমই অপেক্ষা করতে হয়নি!",
                service: "সিগনেচার হেয়ার কাট",
              },
              {
                name: "নুসরাত জাহান",
                rating: 5,
                comment: "ফেসিয়াল এবং হেয়ার স্পার যত্ন দারুণ লেগেছে। পরিবেশ অত্যন্ত পরিচ্ছন্ন এবং কর্মীরা খুবই আন্তরিক।",
                service: "গ্লো ফেসিয়াল",
              },
              {
                name: "শাহরিয়ার কবির",
                rating: 5,
                comment: "বিয়ার্ড ট্রিম এবং গ্রুমিং এর ফিনিশিং ছিল পারফেক্ট। নিয়মিত সেবা নেওয়ার মতো নির্ভরযোগ্য সেলুন।",
                service: "বিয়ার্ড গ্রুমিং",
              },
            ].map((rev, idx) => (
              <Card key={idx} className="p-6 bg-white space-y-4">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-salon-dark italic leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="pt-2 border-t border-salon-primary/10 flex items-center justify-between">
                  <span className="text-xs font-bold text-salon-dark">{rev.name}</span>
                  <span className="text-xs text-salon-primary font-medium">{rev.service}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-salon-primary-800 to-salon-primary text-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            আজই আপনার পছন্দের সময়ে অ্যাপয়েন্টমেন্ট নিশ্চিত করুন
          </h2>
          <p className="text-base text-gray-200 max-w-2xl mx-auto">
            কোনো অগ্রিম চার্জ ছাড়াই মাত্র দুই মিনিটে বুকিং সম্পন্ন করুন।
          </p>
          <div className="pt-2">
            <Link href="/book">
              <Button variant="secondary" size="lg" className="font-bold text-base px-8 py-3.5">
                বুকিং করতে এখানে ক্লিক করুন
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
