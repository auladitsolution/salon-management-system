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
      setErrorMessage("নাম এবং মোবাইল নম্বর দেওয়া আবশ্যক।");
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

  return (
    <div className="min-h-screen flex flex-col bg-salon-cream">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Progress Step Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-salon-primary-100 text-salon-primary text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>অনলাইন সেলুন রিজার্ভেশন</span>
          </div>
          <h1 className="text-3xl font-extrabold text-salon-dark">
            অ্যাপয়েন্টমেন্ট বুকিং
          </h1>
          <p className="text-sm text-salon-muted mt-1">
            ধাপ {toBengaliNumerals(step)}:{" "}
            {step === 1 && bn.booking.step1}
            {step === 2 && bn.booking.step2}
            {step === 3 && bn.booking.step3}
            {step === 4 && bn.booking.step4}
            {step === 5 && bn.booking.step5}
          </p>

          {/* Stepper Dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? "w-8 bg-salon-primary"
                    : s < step
                    ? "w-4 bg-emerald-500"
                    : "w-2 bg-salon-primary/20"
                }`}
              />
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: SERVICE SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-bold text-salon-dark mb-4 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-salon-primary" />
                <span>আপনার কাঙ্ক্ষিত সার্ভিস(সমূহ) নির্বাচন করুন</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => {
                  const isSelected = selectedServices.includes(service._id);
                  return (
                    <div
                      key={service._id}
                      onClick={() => toggleService(service._id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-salon-primary bg-salon-primary-50/60 shadow-sm"
                          : "border-salon-primary/10 hover:border-salon-primary/30 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h4 className="font-bold text-salon-dark text-base">{service.name}</h4>
                          <p className="text-xs text-salon-muted leading-relaxed line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                        <div className="text-right shrink-0 pl-3">
                          <span className="font-bold text-salon-primary block">
                            {formatBengaliCurrency(service.priceMinor)}
                          </span>
                          <span className="text-xs text-salon-muted">
                            {toBengaliNumerals(service.durationMinutes)} মি.
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {services.length === 0 && (
                <p className="text-sm text-salon-muted text-center py-6">
                  সার্ভিস লোড হচ্ছে...
                </p>
              )}
            </Card>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm">
                <span className="text-salon-muted">নির্বাচিত সার্ভিস: </span>
                <span className="font-bold text-salon-primary">
                  {toBengaliNumerals(selectedServices.length)} টি
                </span>
                {totalMinor > 0 && (
                  <span className="ml-3 font-semibold text-salon-dark">
                    মোট: {formatBengaliCurrency(totalMinor)}
                  </span>
                )}
              </div>
              <Button
                size="md"
                disabled={selectedServices.length === 0}
                onClick={() => setStep(2)}
                className="gap-2"
              >
                <span>পরবর্তী ধাপ</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: STYLIST SELECTION */}
        {step === 2 && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-bold text-salon-dark mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-salon-primary" />
                <span>পছন্দের স্টাইলিস্ট নির্বাচন করুন</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Any Available Staff Option */}
                <div
                  onClick={() => setSelectedStaffId("any")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedStaffId === "any"
                      ? "border-salon-primary bg-salon-primary-50/60 shadow-sm"
                      : "border-salon-primary/10 hover:border-salon-primary/30 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-salon-primary-100 flex items-center justify-center text-salon-primary font-bold">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-salon-dark">যেকোনো উপলব্ধ কর্মী</h4>
                      <p className="text-xs text-salon-muted">দ্রুততম সময়ে সেবার জন্য উপযুক্ত</p>
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
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-salon-primary bg-salon-primary-50/60 shadow-sm"
                          : "border-salon-primary/10 hover:border-salon-primary/30 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-salon-primary-100 flex items-center justify-center text-salon-primary text-lg font-bold">
                          {staff.fullName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-salon-dark">{staff.fullName}</h4>
                          <p className="text-xs text-salon-muted">{staff.designation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="md" onClick={() => setStep(1)} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span>পেছনে</span>
              </Button>
              <Button size="md" onClick={() => setStep(3)} className="gap-2">
                <span>তারিখ ও সময় বাছুন</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: DATE & TIME SELECTION */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-bold text-salon-dark mb-4 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-salon-primary" />
                    <span>অ্যাপয়েন্টমেন্টের তারিখ</span>
                  </h2>
                  <Input
                    type="date"
                    min={getDhakaTodayString()}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="text-base"
                  />
                  <p className="text-xs text-salon-muted mt-2">
                    নির্বাচিত দিন: {formatBengaliDate(bookingDate)}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-salon-dark mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-salon-primary" />
                    <span>উপলব্ধ সময়সূচি</span>
                  </h2>

                  {loading ? (
                    <p className="text-sm text-salon-muted py-6">সময়সূচী যাচাই করা হচ্ছে...</p>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedTimeSlot === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                              isSelected
                                ? "bg-salon-primary text-white border-salon-primary shadow-sm"
                                : "bg-white text-salon-dark border-salon-primary/20 hover:border-salon-primary"
                            }`}
                          >
                            {formatBengaliTime(slot.time)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                      <p className="font-medium">
                        {bookingDate === getDhakaTodayString()
                          ? "আজকের দিনের সকল স্লটের সময় সমাপ্ত হয়েছে। অনুগ্রহ করে আগামীকালের বা পরবর্তী যেকোনো দিনের তারিখ নির্বাচন করুন।"
                          : bn.booking.noSlots}
                      </p>
                      {bookingDate === getDhakaTodayString() && (
                        <button
                          type="button"
                          onClick={() => setBookingDate(getDhakaTomorrowString())}
                          className="mt-1 text-xs font-bold text-salon-primary hover:text-salon-dark flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-salon-primary/30 shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>আগামীকালের স্লট দেখুন ({formatBengaliDate(getDhakaTomorrowString())})</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="md" onClick={() => setStep(2)} className="gap-2">
                <ChevronLeft className="w-4 h-4" />
                <span>পেছনে</span>
              </Button>
              <Button
                size="md"
                disabled={!selectedTimeSlot}
                onClick={() => setStep(4)}
                className="gap-2"
              >
                <span>গ্রাহক তথ্য দিন</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 4: CUSTOMER DETAILS & REVIEW */}
        {step === 4 && (
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-salon-dark mb-2 flex items-center gap-2">
                <User className="w-5 h-5 text-salon-primary" />
                <span>আপনার যোগাযোগের তথ্য</span>
              </h2>

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
                <label className="block text-sm font-medium text-salon-dark">
                  বিশেষ কোনো অনুরোধ বা নোট (ঐচ্ছিক)
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-salon-primary/20 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-salon-primary"
                  placeholder="যেমন: কোনো অ্যালার্জি বা বিশেষ নির্দেশনা..."
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                />
              </div>
            </Card>

            {/* Booking Summary Box */}
            <Card className="p-6 bg-salon-primary-50/50 border-salon-primary/20">
              <h3 className="font-bold text-salon-dark text-base mb-3">বুকিং সারসংক্ষেপ</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-salon-muted">তারিখ ও সময়:</span>
                  <span className="font-semibold text-salon-dark">
                    {formatBengaliDate(bookingDate)}, {formatBengaliTime(selectedTimeSlot)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-salon-muted">আনুমানিক সময়:</span>
                  <span className="font-semibold text-salon-dark">
                    {toBengaliNumerals(totalDuration)} মিনিট
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-salon-primary/10">
                  <span className="font-bold text-salon-dark">পরিশোধযোগ্য মূল্য:</span>
                  <span className="font-bold text-lg text-salon-primary">
                    {formatBengaliCurrency(totalMinor)}
                  </span>
                </div>
              </div>
            </Card>

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
              <Button type="submit" size="lg" isLoading={loading} className="gap-2 font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>বুকিং নিশ্চিত করুন</span>
              </Button>
            </div>
          </form>
        )}

        {/* STEP 5: CONFIRMATION SCREEN */}
        {step === 5 && confirmedBooking && (
          <Card className="p-8 text-center space-y-6 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-salon-dark">
                {bn.booking.bookingSuccess}
              </h2>
              <p className="text-sm text-salon-muted">
                {bn.booking.guestNotice}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-salon-primary-50 border border-salon-primary/20 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-salon-muted">রেফারেন্স নম্বর:</span>
                <span className="font-mono font-bold text-salon-primary text-base">
                  {confirmedBooking.reference}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-salon-muted">তারিখ ও সময়:</span>
                <span className="font-semibold text-salon-dark">
                  {formatBengaliDate(confirmedBooking.date)}, {formatBengaliTime(confirmedBooking.time)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-salon-muted">মোট প্রদেয়:</span>
                <span className="font-bold text-salon-primary">
                  {formatBengaliCurrency(confirmedBooking.totalMinor)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => window.print()}
                className="w-full"
              >
                রসিদ প্রিন্ট করুন
              </Button>
              <Button
                size="md"
                onClick={() => router.push("/")}
                className="w-full"
              >
                হোমে ফিরে যান
              </Button>
            </div>
          </Card>
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
        <div className="min-h-screen flex items-center justify-center bg-salon-cream text-salon-muted text-sm">
          বুকিং সিস্টেম লোড হচ্ছে...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
