"use client";

import React, { useState, useEffect } from "react";
import { Receipt, Plus, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatBengaliCurrency } from "@/lib/money/poisha";
import { formatBengaliDate, getDhakaTodayString } from "@/lib/dates/bengaliDate";

interface ExpenseItem {
  _id: string;
  title: string;
  category: string;
  amountMinor: number;
  expenseDate: string;
  paymentMethod: string;
  description?: string;
}

const CATEGORY_NAMES: Record<string, string> = {
  rent: "দোকান ভাড়া",
  utility: "বিদ্যুৎ ও পানি বিল",
  salary: "কর্মচারী বেতন",
  inventory: "পণ্য ক্রয়",
  maintenance: "মেরামত ও সরঞ্জাম",
  marketing: "বিজ্ঞাপন ও প্রচার",
  other: "অন্যান্য খরচ",
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("utility");
  const [amountBdt, setAmountBdt] = useState("");
  const [expenseDate, setExpenseDate] = useState(getDhakaTodayString());
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [description, setDescription] = useState("");

  const loadExpenses = async () => {
    try {
      const res = await fetch("/api/expenses").then((r) => r.json());
      if (res.success) setExpenses(res.data);
    } catch (err) {
      console.error("Expenses load error:", err);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const totalExpenseMinor = expenses.reduce((sum, e) => sum + e.amountMinor, 0);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          amount: parseFloat(amountBdt),
          expenseDate,
          paymentMethod,
          description,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("খরচ সফলভাবে যুক্ত হয়েছে!");
        setIsModalOpen(false);
        setTitle("");
        setAmountBdt("");
        setDescription("");
        loadExpenses();
      } else {
        alert(data.message || "খরচ যোগ করতে ব্যর্থ");
      }
    } catch {
      alert("সার্ভার ত্রুটি");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            দৈনিক ও মাসিক আয়-ব্যয় ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            দোকান ভাড়া, বিল, বেতন ও সেলুনের অন্যান্য ব্যয়ের হিসাব
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-gray-500 block">মোট ব্যয়ের হিসাব</span>
            <span className="text-lg font-bold text-rose-600">
              {formatBengaliCurrency(totalExpenseMinor)}
            </span>
          </div>
          <Button size="sm" onClick={() => setIsModalOpen(true)} className="text-xs gap-1.5 font-bold">
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন খরচ যোগ করুন</span>
          </Button>
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="font-bold">×</button>
        </div>
      )}

      {/* Expenses Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
              <tr>
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4">শিরোনাম ও বিবরণ</th>
                <th className="py-3 px-4">ক্যাটেগরি</th>
                <th className="py-3 px-4">পেমেন্ট মাধ্যম</th>
                <th className="py-3 px-4 font-bold text-rose-600">পরিমাণ (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {expenses.map((exp) => (
                <tr key={exp._id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-gray-700">
                    {formatBengaliDate(exp.expenseDate)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gray-900 block">{exp.title}</span>
                    <span className="text-[11px] text-gray-400">{exp.description || "—"}</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">
                    {CATEGORY_NAMES[exp.category] || exp.category}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 capitalize">
                    {exp.paymentMethod}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-rose-600 text-sm">
                    {formatBengaliCurrency(exp.amountMinor)}
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    কোনো খরচের রেকর্ড পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Add Expense */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="নতুন খরচের এন্ট্রি দিন"
      >
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <Input
            label="খরচের শিরোনাম *"
            placeholder="যেমন: চলতি মাসের বিদ্যুৎ বিল"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-salon-dark mb-1">
                ক্যাটেগরি *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-salon-primary/20 text-sm focus:ring-2 focus:ring-salon-primary"
              >
                <option value="rent">দোকান ভাড়া</option>
                <option value="utility">বিদ্যুৎ ও পানি বিল</option>
                <option value="salary">কর্মচারী বেতন</option>
                <option value="inventory">পণ্য ক্রয়</option>
                <option value="maintenance">মেরামত ও রক্ষণাবেক্ষণ</option>
                <option value="marketing">বিজ্ঞাপন ও প্রমোশন</option>
                <option value="other">অন্যান্য খরচ</option>
              </select>
            </div>

            <Input
              label="পরিমাণ (টাকা) *"
              type="number"
              placeholder="1500"
              value={amountBdt}
              onChange={(e) => setAmountBdt(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="তারিখ *"
              type="date"
              value={expenseDate}
              onChange={(e) => setExpenseDate(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-salon-dark mb-1">
                পেমেন্ট মাধ্যম
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-salon-primary/20 text-sm focus:ring-2 focus:ring-salon-primary"
              >
                <option value="cash">নগদ (Cash)</option>
                <option value="bkash">বিকাশ (bKash)</option>
                <option value="nagad">নগদ (Nagad)</option>
                <option value="bank">ব্যাংক একাউন্ট</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-salon-dark mb-1">
              বিস্তারিত বিবরণ
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-salon-primary/20 text-sm focus:ring-2 focus:ring-salon-primary"
              placeholder="অতিরিক্ত কোনো তথ্য বা বিলের রেফারেন্স..."
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
              সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
