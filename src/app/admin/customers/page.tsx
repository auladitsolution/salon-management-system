"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Users, Plus, Search, Phone, Mail, Award } from "lucide-react";
import { Card } from "@/components/ui/Card";
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            গ্রাহক ব্যবস্থাপনা (CRM)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            গ্রাহকের তথ্যাদি, ভিজিট সংখ্যা ও আজীবন খরচ রেকর্ড
          </p>
        </div>

        <Button size="sm" onClick={() => setIsModalOpen(true)} className="text-xs gap-1.5 font-bold">
          <Plus className="w-3.5 h-3.5" />
          <span>নতুন গ্রাহক নিবন্ধন</span>
        </Button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="font-bold">×</button>
        </div>
      )}

      {/* Search Bar */}
      <Card className="p-4">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="গ্রাহকের নাম বা মোবাইল দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-salon-primary"
          />
        </div>
      </Card>

      {/* Customers Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
              <tr>
                <th className="py-3 px-4">গ্রাহকের নাম</th>
                <th className="py-3 px-4">মোবাইল নম্বর</th>
                <th className="py-3 px-4">ইমেইল</th>
                <th className="py-3 px-4">মোট ভিজিট</th>
                <th className="py-3 px-4">মোট খরচ (৳)</th>
                <th className="py-3 px-4">সর্বশেষ ভিজিট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-gray-900">{c.name}</td>
                  <td className="py-3.5 px-4 text-gray-700">{c.phone}</td>
                  <td className="py-3.5 px-4 text-gray-500">{c.email || "—"}</td>
                  <td className="py-3.5 px-4 text-gray-700 font-semibold">
                    {toBengaliNumerals(c.totalVisits)} বার
                  </td>
                  <td className="py-3.5 px-4 font-bold text-salon-primary">
                    {formatBengaliCurrency(c.totalSpendMinor)}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {c.lastVisitDate ? formatBengaliDate(c.lastVisitDate) : "—"}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    কোনো গ্রাহক পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

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
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-salon-dark mb-1">
              নোট / পছন্দসমূহ
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-salon-primary/20 text-sm focus:ring-2 focus:ring-salon-primary"
              placeholder="যেমন: বিশেষ কোনো পছন্দের স্টাইল বা অ্যালার্জি..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
              className="w-full"
            >
              বাতিল
            </Button>
            <Button type="submit" size="md" isLoading={loading} className="w-full font-bold">
              নিবন্ধন করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
