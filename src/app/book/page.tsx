"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import {
  Scissors,
  User,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  Printer,
  Home,
  ShieldCheck,
  Star,
} from "lucide-react";
import { formatBengaliCurrency, toBengaliNumerals } from "@/lib/money/poisha";
import { formatBengaliDate, getDhakaTodayString, getDhakaTomorrowString, formatBengaliTime } from "@/lib/dates/bengaliDate";
import { bn } from "@/i18n/bn";

interface ServiceItem {
  _id: string;
  name: string;
  priceMinor: number;
  durationMinutes: number;
  description: string;
}

interface StaffItem {
  _id: string;
  fullName: string;
  designation: string;
}

interface AvailableSlot {
  time: string;
  availableStaffIds: string[];
}

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get("serviceId");

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Data loaded from backend
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [staffList, setStaffList] = useState<StaffItem[]>([]);

  // Selected Booking State
  const [selectedServices, setSelectedServices] = useState<string[]>(
    preselectedServiceId ? [preselectedServiceId] : []
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string>("any");
  const [bookingDate, setBookingDate] = useState<string>(getDhakaTodayString());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  // Customer Form
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  // Success Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState<{
    reference: string;
    date: string;
    time: string;
    totalMinor: number;
  } | null>(null);

  // Load Services and Staff
  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, staffRes] = await Promise.all([
          fetch("/api/services").then((r) => r.json()),
          fetch("/api/staff").then((r) => r.json()),
        ]);
        if (servicesRes.success) setServices(servicesRes.data);
        if (staffRes.success) setStaffList(staffRes.data);
      } catch (err) {
        console.error("Failed to load booking catalog:", err);
      }
    }
    loadData();
  }, []);

  // Fetch Available Slots whenever date, services, or staff change
  useEffect(() => {
    if (selectedServices.length === 0 || !bookingDate) return;

    async function fetchSlots() {
      setLoading(true);
      setErrorMessage("");
      setSelectedTimeSlot("");
      try {
        const url = `/api/availability?date=${bookingDate}&serviceIds=${selectedServices.join(",")}&staffId=${selectedStaffId}`;
        const res = await fetch(url).then((r) => r.json());
        if (res.success && res.data.slots) {
          setAvailableSlots(res.data.slots);
        } else {
          setAvailableSlots([]);
          if (res.data?.message) setErrorMessage(res.data.message);
        }
      } catch (err) {
        console.error("Slot fetch error:", err);
        setErrorMessage("সময়সূচী লোড করতে সমস্যা হয়েছে।");
      } finally {
        setLoading(false);
      }
    }

    if (step === 3) {
      fetchSlots();
    }
  }, [step, bookingDate, selectedServices, selectedStaffId]);

  // Handle Service Selection Toggle
  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter((s) => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  // Calculate Totals
  const selectedServiceObjects = services.filter((s) => selectedServices.includes(s._id));
  const totalMinor = selectedServiceObjects.reduce((acc, s) => acc + s.priceMinor, 0);
  const totalDuration = selectedServiceObjects.reduce((acc, s) => acc + s.durationMinutes, 0);

  // Handle Form Submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage("আপনার নাম এবং মোবাইল নম্বর দেওয়া আবশ্যক।");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        serviceIds: selectedServices,
        staffId: selectedStaffId,
        appointmentDate: bookingDate,
        startTime: selectedTimeSlot,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerNotes: customerNotes.trim() || undefined,
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "বুকিং নিশ্চিত করতে ব্যর্থ হয়েছে।");
        return;
      }

      setConfirmedBooking({
        reference: data.data.bookingReference,
        date: data.data.appointmentDate,
        time: data.data.startTime,
        totalMinor: data.data.totalMinor,
      });
      setStep(5); // Confirmation Screen
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "সার্ভার সংযোগে ত্রুটি ঘটেছে।");
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    { num: 1, title: "সার্ভিস নির্বাচন", desc: "পছন্দের সেবা বাছুন" },
    { num: 2, title: "স্টাইলিস্ট", desc: "বিশেষজ্ঞ বেছে নিন" },
    { num: 3, title: "তারিখ ও সময়", desc: "স্লট নিশ্চিত করুন" },
    { num: 4, title: "গ্রাহক তথ্য", desc: "যোগাযোগ ও নিশ্চিতকরণ" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-mesh-salon antialiased">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        
        {/* Modern Interactive Stepper Header */}
        <div className="mb-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-100 to-purple-100 border border-rose-200/60 shadow-xs">
            <Sparkles className="w-4 h-4 text-rose-600 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">সহজ অনলাইন অ্যাপয়েন্টমেন্ট বুকিং</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            আপনার পছন্দের সময়ে স্লট রিজার্ভ করুন
          </h1>

          {/* Stepper Wizard Bar */}
          {step <= 4 && (
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="grid grid-cols-4 gap-2 relative">
                {stepTitles.map((st) => {
                  const isDone = st.num < step;
                  const isCurrent = st.num === step;
                  return (
                    <div key={st.num} className="flex flex-col items-center text-center">
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-md ${
                          isDone
                            ? "bg-emerald-500 text-white shadow-emerald-500/20"
                            : isCurrent
                            ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-rose-600/30 ring-4 ring-rose-100 scale-105"
                            : "bg-white text-slate-400 border border-slate-200"
                        }`}
                      >
                        {isDone ? <Check className="w-5 h-5" /> : toBengaliNumerals(st.num)}
                      </div>
                      <span className={`text-xs font-bold mt-2 ${isCurrent ? "text-rose-600" : isDone ? "text-emerald-700" : "text-slate-400"}`}>
                        {st.title}
                      </span>
                      <span className="text-[10px] text-slate-500 hidden sm:block">{st.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-bold flex items-start gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: SERVICE SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100/80 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-600 text-white flex items-center justify-center shadow-md">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900">কাঙ্ক্ষিত সার্ভিসসমূহ নির্বাচন করুন</h2>
                    <p className="text-xs text-slate-500">এক বা একাধিক সেবা নির্বাচন করতে পারেন</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60">
                  {toBengaliNumerals(selectedServices.length)} টি সার্ভিস নির্বাচিত
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => {
                  const isSelected = selectedServices.includes(service._id);
                  return (
                    <div
                      key={service._id}
                      onClick={() => toggleService(service._id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative group ${
                        isSelected
                          ? "border-rose-500 bg-gradient-to-br from-rose-50/90 to-purple-50/60 shadow-md shadow-rose-500/10"
                          : "border-slate-200 hover:border-rose-300 bg-white hover:bg-rose-50/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs ${isSelected ? "bg-rose-600 text-white" : "border border-slate-300 group-hover:border-rose-400"}`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </span>
                            <h4 className="font-bold text-slate-900 text-base">{service.name}</h4>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 pl-7">
                            {service.description}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-black text-rose-600 text-base block">
                            {formatBengaliCurrency(service.priceMinor)}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1">
                            ⏱ {toBengaliNumerals(service.durationMinutes)} মি.
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {services.length === 0 && (
                <p className="text-sm text-slate-500 text-center py-8">
                  সার্ভিস তালিকা লোড হচ্ছে...
                </p>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="text-sm">
                <span className="text-slate-600">নির্বাচিত: </span>
                <span className="font-bold text-rose-600">
                  {toBengaliNumerals(selectedServices.length)} টি
                </span>
                {totalMinor > 0 && (
                  <span className="ml-4 font-black text-slate-900">
                    আনুমানিক বিল: <span className="text-rose-600">{formatBengaliCurrency(totalMinor)}</span> ({toBengaliNumerals(totalDuration)} মি.)
                  </span>
                )}
              </div>
              <Button
                size="md"
                variant="primary"
                disabled={selectedServices.length === 0}
                onClick={() => setStep(2)}
                className="w-full sm:w-auto gap-2 font-bold shadow-glow"
              >
                <span>পরবর্তী: স্টাইলিস্ট বাছুন</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: STYLIST SELECTION */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100/80 shadow-xl space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-rose-100">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">পছন্দের স্টাইলিস্ট নির্বাচন করুন</h2>
                  <p className="text-xs text-slate-500">বিশেষ কোনো কর্মী না থাকলে &apos;যেকোনো উপলব্ধ কর্মী&apos; বেছে নিন</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Any Available Staff Option */}
                <div
                  onClick={() => setSelectedStaffId("any")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedStaffId === "any"
                      ? "border-rose-500 bg-rose-50/80 shadow-md shadow-rose-500/10"
                      : "border-slate-200 hover:border-rose-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-base">যেকোনো উপলব্ধ কর্মী</h4>
                      <p className="text-xs text-slate-500 mt-0.5">সবচেয়ে দ্রুত সময়ে স্লট পাওয়ার জন্য উপযুক্ত</p>
                    </div>
                  </div>
                </div>

                {/* Specific Staff */}
                {staffList.map((staff) => {
                  const isSelected = selectedStaffId === staff._id;
                  return (
                    <div
                      key={staff._id}
                      onClick={() => setSelectedStaffId(staff._id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? "border-rose-500 bg-rose-50/80 shadow-md shadow-rose-500/10"
                          : "border-slate-200 hover:border-rose-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg font-black shadow-md">
                          {staff.fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-base">{staff.fullName}</h4>
                          <p className="text-xs text-rose-600 font-bold mt-0.5">{staff.designation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="md" onClick={() => setStep(1)} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span>পেছনে</span>
              </Button>
              <Button variant="primary" size="md" onClick={() => setStep(3)} className="gap-2 font-bold shadow-glow">
                <span>তারিখ ও সময় বাছুন</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: DATE & TIME SELECTION */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100/80 shadow-xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Date Picker */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-rose-100">
                    <CalendarIcon className="w-5 h-5 text-rose-600" />
                    <h2 className="text-base font-black text-slate-900">তারিখ নির্বাচন</h2>
                  </div>
                  <Input
                    type="date"
                    min={getDhakaTodayString()}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="text-base font-semibold"
                  />
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200/60 text-xs text-slate-700 space-y-1">
                    <p className="font-bold text-rose-700">নির্বাচিত দিন: {formatBengaliDate(bookingDate)}</p>
                    <p className="text-[11px] text-slate-500">আমরা সকাল ০৯:০০ হতে রাত ২১:০০ পর্যন্ত সেবা প্রদান করি।</p>
                  </div>
                </div>

                {/* Time Slots */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-rose-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <h2 className="text-base font-black text-slate-900">উপলব্ধ সময়সূচি</h2>
                    </div>
                    {availableSlots.length > 0 && (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {toBengaliNumerals(availableSlots.length)} টি স্লট ফাঁকা
                      </span>
                    )}
                  </div>

                  {loading ? (
                    <div className="text-center py-10 text-slate-500 text-xs font-semibold">
                      লাইভ সময়সূচি যাচাই করা হচ্ছে...
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedTimeSlot === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all duration-200 ${
                              isSelected
                                ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white border-rose-500 shadow-md shadow-rose-600/30 scale-105"
                                : "bg-white text-slate-800 border-rose-200/80 hover:border-rose-400 hover:bg-rose-50/50"
                            }`}
                          >
                            {formatBengaliTime(slot.time)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                      <p className="font-semibold">
                        {bookingDate === getDhakaTodayString()
                          ? "আজকের দিনের সকল স্লটের সময় সমাপ্ত হয়েছে বা বুকড। পরবর্তী দিনের তারিখ নির্বাচন করুন।"
                          : bn.booking.noSlots}
                      </p>
                      {bookingDate === getDhakaTodayString() && (
                        <button
                          type="button"
                          onClick={() => setBookingDate(getDhakaTomorrowString())}
                          className="mt-1 text-xs font-bold text-rose-700 hover:text-slate-900 flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-xl border border-rose-300 shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>আগামীকালের স্লট দেখুন ({formatBengaliDate(getDhakaTomorrowString())})</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="md" onClick={() => setStep(2)} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span>পেছনে</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                disabled={!selectedTimeSlot}
                onClick={() => setStep(4)}
                className="gap-2 font-bold shadow-glow"
              >
                <span>গ্রাহক তথ্য ও নিশ্চিতকরণ</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: CUSTOMER DETAILS & REVIEW */}
        {step === 4 && (
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-rose-100/80 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-rose-100">
                <User className="w-5 h-5 text-rose-600" />
                <h2 className="text-lg font-black text-slate-900">আপনার যোগাযোগের তথ্য</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="পূর্ণ নাম *"
                  placeholder="যেমন: সাকিব আল হাসান"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
                <Input
                  label="মোবাইল নম্বর *"
                  placeholder="017XXXXXXXX"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>

              <Input
                label="ইমেইল (ঐচ্ছিক)"
                type="email"
                placeholder="example@mail.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-900">
                  বিশেষ কোনো অনুরোধ বা নির্দেশনা (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-2xl border border-rose-200/80 p-3.5 text-sm focus:outline-none focus:ring-4 focus:ring-rose-500/15 focus:border-rose-500"
                  placeholder="যেমন: কোনো বিশেষ স্কিন অ্যালার্জি বা চুলের ধরন..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Booking Summary Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50/80 via-purple-50/60 to-amber-50/50 border border-rose-200 shadow-lg space-y-3">
              <h3 className="font-black text-slate-900 text-base">বুকিং সারসংক্ষেপ রসিদ</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">তারিখ ও সময়সূচি:</span>
                  <span className="font-bold text-slate-900">
                    {formatBengaliDate(bookingDate)}, {formatBengaliTime(selectedTimeSlot)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">আনুমানিক সময়:</span>
                  <span className="font-bold text-slate-900">
                    {toBengaliNumerals(totalDuration)} মিনিট
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-rose-200">
                  <span className="font-black text-slate-900">পরিশোধযোগ্য বিল:</span>
                  <span className="font-black text-xl text-rose-600">
                    {formatBengaliCurrency(totalMinor)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setStep(3)}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>পেছনে</span>
              </Button>
              <Button type="submit" size="lg" variant="primary" isLoading={loading} className="gap-2 font-black shadow-glow">
                <CheckCircle2 className="w-5 h-5" />
                <span>বুকিং চূড়ান্ত করুন</span>
              </Button>
            </div>
          </form>
        )}

        {/* STEP 5: CONFIRMATION SUCCESS SCREEN */}
        {step === 5 && confirmedBooking && (
          <div className="p-8 rounded-3xl bg-white border border-rose-200 shadow-2xl text-center space-y-6 max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">
                {bn.booking.bookingSuccess}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                আপনার বুকিং সফলভাবে গৃহীত হয়েছে। সেলুনে আসার সময় নিচের রেফারেন্স কোডটি প্রদর্শন করুন।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-purple-50 border border-rose-200 space-y-2.5 text-sm text-left">
              <div className="flex justify-between items-center pb-2 border-b border-rose-200">
                <span className="text-slate-600 font-semibold">রেফারেন্স কোড:</span>
                <span className="font-mono font-black text-rose-600 text-lg">
                  {confirmedBooking.reference}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">তারিখ ও সময়:</span>
                <span className="font-bold text-slate-900">
                  {formatBengaliDate(confirmedBooking.date)}, {formatBengaliTime(confirmedBooking.time)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-rose-200">
                <span className="text-slate-900 font-bold">মোট বিল:</span>
                <span className="font-black text-rose-600 text-lg">
                  {formatBengaliCurrency(confirmedBooking.totalMinor)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => window.print()}
                className="w-full gap-2 font-bold"
              >
                <Printer className="w-4 h-4" />
                <span>রসিদ প্রিন্ট করুন</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => router.push("/")}
                className="w-full gap-2 font-bold shadow-glow"
              >
                <Home className="w-4 h-4" />
                <span>হোমে ফিরে যান</span>
              </Button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-mesh-salon text-slate-600 text-sm font-semibold">
          বুকিং সিস্টেম লোড হচ্ছে...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
