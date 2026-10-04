"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Scissors, Plus, Sparkles, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatBengaliCurrency, toBengaliNumerals } from "@/lib/money/poisha";

interface ServiceCategory {
  _id: string;
  name: string;
}

interface ServiceItem {
  _id: string;
  name: string;
  priceMinor: number;
  durationMinutes: number;
  description: string;
  categoryId?: { _id: string; name: string };
  isActive: boolean;
  onlineBookingEnabled: boolean;
}

export default function ServicesManagementPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form states for new service
  const [serviceName, setServiceName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priceBdt, setPriceBdt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("30");
  const [description, setDescription] = useState("");

  // Form states for new category
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState("");

  const loadData = useCallback(async () => {
    try {
      const [servRes, catRes] = await Promise.all([
        fetch("/api/services").then((r) => r.json()),
        fetch("/api/services/categories").then((r) => r.json()),
      ]);
      if (servRes.success) setServices(servRes.data);
      if (catRes.success) {
        setCategories(catRes.data);
        setCategoryId((prev) => prev || (catRes.data.length > 0 ? catRes.data[0]._id : ""));
      }
    } catch (err) {
      console.error("Services page error:", err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: serviceName,
          categoryId,
          price: parseFloat(priceBdt),
          durationMinutes: parseInt(durationMinutes, 10),
          description,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("সার্ভিস সফলভাবে যুক্ত হয়েছে!");
        setIsAddServiceModalOpen(false);
        setServiceName("");
        setPriceBdt("");
        setDescription("");
        loadData();
      } else {
        alert(data.message || "সার্ভিস তৈরিতে ব্যর্থ");
      }
    } catch {
      alert("সার্ভার ত্রুটি");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/services/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName, description: categoryDesc }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("ক্যাটেগরি সফলভাবে যুক্ত হয়েছে!");
        setIsAddCategoryModalOpen(false);
        setCategoryName("");
        setCategoryDesc("");
        loadData();
      } else {
        alert(data.message || "ক্যাটেগরি তৈরিতে ব্যর্থ");
      }
    } catch {
      alert("সার্ভার ত্রুটি");
    } finally {
      setLoading(false);
    }
  };

  const [seedLoading, setSeedLoading] = useState(false);

  const handleSeedDemo = async () => {
    if (!confirm("আপনি কি ১৮টি ডেমো সার্ভিস, ক্যাটেগরি ও স্টাফ ডাটাবেজে স্বয়ংক্রিয়ভাবে লোড করতে চান?")) {
      return;
    }
    setSeedLoading(true);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message || "ডেমো সার্ভিস সফলভাবে তৈরি করা হয়েছে!");
        loadData();
      } else {
        alert(data.message || "ডেমো সার্ভিস লোড করতে ব্যর্থ");
      }
    } catch {
      alert("সার্ভার ত্রুটি");
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            সার্ভিস ও ক্যাটেগরি ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            সেলুনের সকল সেবা, মূল্যতালিকা ও সময়কাল কনফিগারেশন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSeedDemo}
            isLoading={seedLoading}
            className="text-xs gap-1.5 border-amber-300 text-amber-900 hover:bg-amber-50 bg-amber-50/50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>ডেমো সার্ভিস লোড করুন</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddCategoryModalOpen(true)}
            className="text-xs"
          >
            নতুন ক্যাটেগরি
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddServiceModalOpen(true)}
            className="text-xs gap-1.5 font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন সার্ভিস যোগ</span>
          </Button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="font-bold">×</button>
        </div>
      )}

      {/* Services Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
              <tr>
                <th className="py-3 px-4">সার্ভিসের নাম</th>
                <th className="py-3 px-4">ক্যাটেগরি</th>
                <th className="py-3 px-4">সময়কাল</th>
                <th className="py-3 px-4">মূল্য (৳)</th>
                <th className="py-3 px-4">অনলাইন বুকিং</th>
                <th className="py-3 px-4">অবস্থা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-gray-900 block">{s.name}</span>
                    <span className="text-[11px] text-gray-400 line-clamp-1">{s.description}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {s.categoryId?.name || "জেনারেল"}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {toBengaliNumerals(s.durationMinutes)} মিনিট
                  </td>
                  <td className="py-3 px-4 font-bold text-salon-primary">
                    {formatBengaliCurrency(s.priceMinor)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      s.onlineBookingEnabled ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {s.onlineBookingEnabled ? "সক্রিয়" : "বন্ধ"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      একটিভ
                    </span>
                  </td>
                </tr>
              ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    কোনো সার্ভিস পাওয়া যায়নি। উপরের বাটন দিয়ে সার্ভিস তৈরি করুন।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Add Service */}
      <Modal
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
        title="নতুন সার্ভিস যুক্ত করুন"
      >
        <form onSubmit={handleCreateService} className="space-y-4">
          <Input
            label="সার্ভিসের নাম *"
            placeholder="যেমন: প্রিমিয়াম হেয়ার স্পা"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-salon-dark mb-1">
              ক্যাটেগরি *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-salon-primary/20 text-sm focus:ring-2 focus:ring-salon-primary"
              required
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="মূল্য (টাকা) *"
              type="number"
              placeholder="500"
              value={priceBdt}
              onChange={(e) => setPriceBdt(e.target.value)}
              required
            />
            <Input
              label="সময়কাল (মিনিট) *"
              type="number"
              placeholder="30"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-salon-dark mb-1">
              বর্ণনা
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-salon-primary/20 text-sm focus:ring-2 focus:ring-salon-primary"
              placeholder="সার্ভিসের বিবরণ লিখুন..."
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsAddServiceModalOpen(false)}
              className="w-full"
            >
              বাতিল
            </Button>
            <Button type="submit" size="md" isLoading={loading} className="w-full font-bold">
              সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Category */}
      <Modal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        title="নতুন সার্ভিস ক্যাটেগরি যুক্ত করুন"
      >
        <form onSubmit={handleCreateCategory} className="space-y-4">
          <Input
            label="ক্যাটেগরির নাম *"
            placeholder="যেমন: ব্রাইডাল মেকওভার"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
          <div>
            <label className="block text-sm font-medium text-salon-dark mb-1">
              বিবরণ (ঐচ্ছিক)
            </label>
            <textarea
              rows={2}
              value={categoryDesc}
              onChange={(e) => setCategoryDesc(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-salon-primary/20 text-sm focus:ring-2 focus:ring-salon-primary"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsAddCategoryModalOpen(false)}
              className="w-full"
            >
              বাতিল
            </Button>
            <Button type="submit" size="md" isLoading={loading} className="w-full font-bold">
              সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
