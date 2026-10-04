"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, Download, TrendingUp, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatBengaliCurrency, toBengaliNumerals } from "@/lib/money/poisha";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({
    todaySalesMinor: 0,
    monthlySalesMinor: 0,
    duePaymentsMinor: 0,
    monthlyExpenseMinor: 0,
    netOperatingCashMinor: 0,
    completedServices: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch("/api/reports").then((r) => r.json());
        if (res.success && res.data) {
          setKpis(res.data.kpis);
        }
      } catch (err) {
        console.error("Reports load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handleExport = (type: string) => {
    window.open(`/api/export/csv?type=${type}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            রিপোর্ট, অ্যানালিটিক্স ও ডাটা এক্সপোর্ট
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            সেলুন ব্যবসার আর্থিক হিসাবনিকাশ এবং CSV ফাইল ডাউনলোড
          </p>
        </div>
      </div>

      {/* Financial Health Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-l-salon-primary">
          <span className="text-xs text-gray-500 font-medium">চলতি মাসের বিক্রয়</span>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">
            {formatBengaliCurrency(kpis.monthlySalesMinor)}
          </h3>
          <span className="text-[11px] text-gray-400 mt-1 block">চূড়ান্ত ইনভয়েস বিক্রয়</span>
        </Card>

        <Card className="p-5 border-l-4 border-l-rose-500">
          <span className="text-xs text-gray-500 font-medium">চলতি মাসের মোট খরচ</span>
          <h3 className="text-2xl font-bold text-rose-600 mt-1">
            {formatBengaliCurrency(kpis.monthlyExpenseMinor)}
          </h3>
          <span className="text-[11px] text-gray-400 mt-1 block">ভাড়া, বিল, বেতন ও মালামাল</span>
        </Card>

        <Card className="p-5 border-l-4 border-l-emerald-500">
          <span className="text-xs text-gray-500 font-medium">নিট অপারেটিং ক্যাশ ফ্লো</span>
          <h3 className="text-2xl font-bold text-emerald-600 mt-1">
            {formatBengaliCurrency(kpis.netOperatingCashMinor)}
          </h3>
          <span className="text-[11px] text-gray-400 mt-1 block">বিক্রয় ও ব্যয়ের পার্থক্য</span>
        </Card>

        <Card className="p-5 border-l-4 border-l-amber-500">
          <span className="text-xs text-gray-500 font-medium">মোট বকেয়া পাওনা</span>
          <h3 className="text-2xl font-bold text-amber-600 mt-1">
            {formatBengaliCurrency(kpis.duePaymentsMinor)}
          </h3>
          <span className="text-[11px] text-gray-400 mt-1 block">পরিশোধ না করা বিলের যোগফল</span>
        </Card>
      </div>

      {/* CSV Data Export Center */}
      <Card className="p-6 space-y-4">
        <div className="pb-3 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">
            প্রশাসনিক ডাটা এক্সপোর্ট (CSV ফরম্যাট)
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            নিরাপদ এবং ফর্মুলা ইনজেকশন মুক্ত এক্সেল সামঞ্জস্যপূর্ণ বাংলা ডাটাবেজ ব্যাকআপ
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border border-gray-200 space-y-2 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm text-gray-800">গ্রাহক তালিকা (CRM)</h4>
              <p className="text-xs text-gray-500 mt-1">
                গ্রাহকদের নাম, ফোন নম্বর, ভিজিট সংখ্যা ও মোট খরচের রেকর্ড।
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("customers")}
              className="gap-2 text-xs font-semibold w-full mt-3"
            >
              <Download className="w-3.5 h-3.5" />
              <span>গ্রাহক ডাটা এক্সপোর্ট</span>
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 space-y-2 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm text-gray-800">অ্যাপয়েন্টমেন্ট বুকিং রিপোর্ট</h4>
              <p className="text-xs text-gray-500 mt-1">
                সকল ঐতিহাসিক অ্যাপয়েন্টমেন্ট, সময়সূচি, স্ট্যাটাস ও স্টাইলিস্ট।
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("appointments")}
              className="gap-2 text-xs font-semibold w-full mt-3"
            >
              <Download className="w-3.5 h-3.5" />
              <span>বুকিং ডাটা এক্সপোর্ট</span>
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 space-y-2 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm text-gray-800">বিক্রয় ও ইনভয়েস লেজার</h4>
              <p className="text-xs text-gray-500 mt-1">
                সকল সমাপ্ত বিক্রয়, প্রাপ্ত পেমেন্ট, বকেয়া এবং ভ্যাটের হিসাব।
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("sales")}
              className="gap-2 text-xs font-semibold w-full mt-3"
            >
              <Download className="w-3.5 h-3.5" />
              <span>বিক্রয় লেজার এক্সপোর্ট</span>
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 space-y-2 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm text-gray-800">ইনভেন্টরি স্টক রিপোর্ট</h4>
              <p className="text-xs text-gray-500 mt-1">
                পণ্যের তালিকা, SKU, ক্রয়মূল্য, বিক্রয়মূল্য ও বর্তমান স্টক সংখ্যা।
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("inventory")}
              className="gap-2 text-xs font-semibold w-full mt-3"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ইনভেন্টরি এক্সপোর্ট</span>
            </Button>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 space-y-2 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm text-gray-800">আয়-ব্যয় রিপোর্ট</h4>
              <p className="text-xs text-gray-500 mt-1">
                দৈনিক ও মাসিক ব্যয়ের বিস্তারিত ক্যাটেগরিভিত্তিক বিবরণ।
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport("expenses")}
              className="gap-2 text-xs font-semibold w-full mt-3"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ব্যয় বিবরণী এক্সপোর্ট</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
