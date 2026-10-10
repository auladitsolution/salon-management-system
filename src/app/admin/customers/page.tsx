"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users, Plus, Search, Phone, Mail, Award, CheckCircle2, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatBengaliCurrency, toBengaliNumerals } from "@/lib/money/poisha";
import { formatBengaliDate } from "@/lib/dates/bengaliDate";

interface CustomerItem {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  totalSpendMinor: number;
  totalVisits: number;
  lastVisitDate?: string;
  notes?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const loadCustomers = useCallback(async () => {
    try {
      const res = await fetch(`/api/customers?search=${search}`).then((r) => r.json());
      if (res.success) setCustomers(res.data);
    } catch (err) {
      console.error("Customers fetch error:", err);
    }
  }, [search]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email, notes }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("গ্রাহক সফলভাবে নিবন্ধিত হয়েছে!");
        setIsModalOpen(false);
        setName("");
        setPhone("");
        setEmail("");
        setNotes("");
        loadCustomers();
      } else {
        alert(data.message || "গ্রাহক তৈরিতে সমস্যা");
      }
    } catch {
      alert("সার্ভার সমস্যা");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">কাস্টমার রিলেশনশিপ (CRM)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            গ্রাহক ডাটাবেজ ও লয়্যালটি
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            গ্রাহকের তথ্যাদি, মোট ভিজিট সংখ্যা এবং লাইফটাইম খরচের পরিসংখ্যান
          </p>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          className="text-xs gap-2 font-bold shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন গ্রাহক নিবন্ধন</span>
        </Button>
      </div>

      {message && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage("")} className="font-bold text-base px-1">×</button>
        </div>
      )}

      {/* Search Bar */}
      <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-xl">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="গ্রাহকের নাম বা মোবাইল দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-4">গ্রাহকের নাম</th>
                <th className="py-3.5 px-4">মোবাইল নম্বর</th>
                <th className="py-3.5 px-4">ইমেইল</th>
                <th className="py-3.5 px-4">মোট ভিজিট</th>
                <th className="py-3.5 px-4">লাইফটাইম খরচ</th>
                <th className="py-3.5 px-4">স্ট্যাটাস লেভেল</th>
                <th className="py-3.5 px-4">সর্বশেষ ভিজিট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {customers.map((c) => {
                const isVip = c.totalSpendMinor > 500000;
                return (
                  <tr key={c._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs border border-emerald-500/30 shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-100">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300 font-medium">{c.phone}</td>
                    <td className="py-4 px-4 text-slate-400">{c.email || "—"}</td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-slate-200 font-bold border border-slate-800">
                        {toBengaliNumerals(c.totalVisits)} বার
                      </span>
                    </td>
                    <td className="py-4 px-4 font-black text-amber-400 text-sm">
                      {formatBengaliCurrency(c.totalSpendMinor)}
                    </td>
                    <td className="py-4 px-4">
                      {isVip ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black">
                          <Crown className="w-3 h-3 text-amber-400" />
                          <span>ভিআইপি মেম্বার</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                          রেগুলার
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {c.lastVisitDate ? formatBengaliDate(c.lastVisitDate) : "—"}
                    </td>
                  </tr>
                );
              })}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 font-semibold">
                    কোনো গ্রাহক পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Customer */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="নতুন গ্রাহক নিবন্ধন করুন"
      >
        <form onSubmit={handleCreateCustomer} className="space-y-4">
          <Input
            label="গ্রাহকের নাম *"
            placeholder="নাম লিখুন"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="মোবাইল নম্বর *"
            placeholder="017XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            label="ইমেইল (ঐচ্ছিক)"
            type="email"
            placeholder="mail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800">নোট বা বিশেষ তথ্য (ঐচ্ছিক)</label>
            <textarea
              rows={2}
              placeholder="গ্রাহকের পছন্দ বা বিশেষ কোনো তথ্য..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 rounded-2xl border border-rose-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
              className="w-full"
            >
              বাতিল
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full font-bold shadow-glow"
            >
              নিবন্ধন সম্পন্ন করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
