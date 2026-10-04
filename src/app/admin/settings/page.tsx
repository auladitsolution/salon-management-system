"use client";

import React, { useState, useEffect } from "react";
import { Settings, Save, ShieldCheck, Store, Clock, Percent } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [salonName, setSalonName] = useState("");
  const [tagline, setTagline] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [openingTime, setOpeningTime] = useState("09:00");
  const [closingTime, setClosingTime] = useState("21:00");
  const [slotIntervalMinutes, setSlotIntervalMinutes] = useState(30);
  const [bookingCutoffHours, setBookingCutoffHours] = useState(2);
  const [maxAdvanceDays, setMaxAdvanceDays] = useState(30);
  const [taxPercent, setTaxPercent] = useState(5);
  const [invoicePrefix, setInvoicePrefix] = useState("INV-");

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings").then((r) => r.json());
        if (res.success && res.data) {
          const s = res.data;
          setSalonName(s.salonName || "");
          setTagline(s.tagline || "");
          setPhone(s.phone || "");
          setEmail(s.email || "");
          setAddress(s.address || "");
          setOpeningTime(s.openingTime || "09:00");
          setClosingTime(s.closingTime || "21:00");
          setSlotIntervalMinutes(s.slotIntervalMinutes || 30);
          setBookingCutoffHours(s.bookingCutoffHours || 2);
          setMaxAdvanceDays(s.maxAdvanceDays || 30);
          setTaxPercent(s.taxPercent || 5);
          setInvoicePrefix(s.invoicePrefix || "INV-");
        }
      } catch (err) {
        console.error("Settings load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          salonName,
          tagline,
          phone,
          email,
          address,
          openingTime,
          closingTime,
          slotIntervalMinutes: Number(slotIntervalMinutes),
          bookingCutoffHours: Number(bookingCutoffHours),
          maxAdvanceDays: Number(maxAdvanceDays),
          taxPercent: Number(taxPercent),
          invoicePrefix,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("সেটিংস সফলভাবে সংরক্ষিত হয়েছে!");
      } else {
        alert(data.message || "সেটিংস সংরক্ষণ ব্যর্থ");
      }
    } catch {
      alert("সার্ভার ত্রুটি");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            সেলুন কনফিগারেশন ও সেটিংস
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            সেলুনের নাম, ব্র্যান্ডিং, খোলার সময়সূচি ও পলিসি পরিবর্তন
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="font-bold">×</button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Salon Branding Info */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Store className="w-4 h-4 text-salon-primary" />
            <span>সেলুনের ব্র্যান্ডিং ও যোগাযোগের তথ্য</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="সেলুনের নাম *"
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
              required
            />
            <Input
              label="স্লোগান / ট্যাগলাইন"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="হটলাইন / মোবাইল নম্বর *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <Input
              label="অফিসিয়াল ইমেইল"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Input
            label="ঠিকানা"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Card>

        {/* Operating Hours & Booking Policy */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Clock className="w-4 h-4 text-salon-primary" />
            <span>সময়সূচি ও বুকিং পলিসি</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="সেলুন খোলার সময়"
              type="time"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
            />
            <Input
              label="সেলুন বন্ধের সময়"
              type="time"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                স্লট ব্যবধান
              </label>
              <select
                value={slotIntervalMinutes}
                onChange={(e) => setSlotIntervalMinutes(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-salon-primary"
              >
                <option value={15}>১৫ মিনিট পরপর</option>
                <option value={30}>৩০ মিনিট পরপর</option>
                <option value={45}>৪৫ মিনিট পরপর</option>
                <option value={60}>৬০ মিনিট পরপর</option>
              </select>
            </div>

            <Input
              label="মিনিমাম অগ্রিম নোটিশ (ঘণ্টা)"
              type="number"
              min="0"
              value={bookingCutoffHours}
              onChange={(e) => setBookingCutoffHours(Number(e.target.value))}
            />

            <Input
              label="সর্বোচ্চ অগ্রিম বুকিং (দিন)"
              type="number"
              min="1"
              value={maxAdvanceDays}
              onChange={(e) => setMaxAdvanceDays(Number(e.target.value))}
            />
          </div>
        </Card>

        {/* Financial & Invoicing Defaults */}
        <Card className="p-6 space-y-4">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
            <Percent className="w-4 h-4 text-salon-primary" />
            <span>আর্থিক সেটিংস ও বিলিং কনফিগারেশন</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="ডিফল্ট ভ্যাট / ট্যাক্স (%)"
              type="number"
              min="0"
              value={taxPercent}
              onChange={(e) => setTaxPercent(Number(e.target.value))}
            />
            <Input
              label="ইনভয়েস নম্বর প্রিফিক্স"
              value={invoicePrefix}
              onChange={(e) => setInvoicePrefix(e.target.value)}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" isLoading={saving} className="gap-2 font-bold px-8">
            <Save className="w-4 h-4" />
            <span>সেটিংস সংরক্ষণ করুন</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
