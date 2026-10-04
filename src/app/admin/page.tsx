"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Users,
  UserCheck,
  AlertCircle,
  Plus,
  CreditCard,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatBengaliCurrency, toBengaliNumerals } from "@/lib/money/poisha";
import { formatBengaliTime, formatBengaliDate } from "@/lib/dates/bengaliDate";
import { bn } from "@/i18n/bn";

interface KpiData {
  todayAppointments: number;
  pendingBookings: number;
  completedServices: number;
  todaySalesMinor: number;
  monthlySalesMinor: number;
  duePaymentsMinor: number;
  totalCustomers: number;
  totalStaff: number;
  lowStockCount: number;
  monthlyExpenseMinor: number;
  netOperatingCashMinor: number;
}

interface AppointmentItem {
  _id: string;
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  bookingStatus: string;
  paymentStatus: string;
  totalMinor: number;
  staffId?: { fullName: string; designation: string };
  services: Array<{ name: string }>;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<KpiData>({
    todayAppointments: 0,
    pendingBookings: 0,
    completedServices: 0,
    todaySalesMinor: 0,
    monthlySalesMinor: 0,
    duePaymentsMinor: 0,
    totalCustomers: 0,
    totalStaff: 0,
    lowStockCount: 0,
    monthlyExpenseMinor: 0,
    netOperatingCashMinor: 0,
  });
  const [recentAppointments, setRecentAppointments] = useState<AppointmentItem[]>([]);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch("/api/reports").then((r) => r.json());
        if (res.success && res.data) {
          setKpis(res.data.kpis);
          setRecentAppointments(res.data.recentAppointments || []);
        }
      } catch (err) {
        console.error("Dashboard report fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const kpiCards = [
    {
      title: bn.dashboard.todayAppointments,
      value: toBengaliNumerals(kpis.todayAppointments),
      sub: "আজকের মোট বুকিং",
      icon: CalendarDays,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: bn.dashboard.pendingBookings,
      value: toBengaliNumerals(kpis.pendingBookings),
      sub: "অনুমোদনের অপেক্ষায়",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: bn.dashboard.completedServices,
      value: toBengaliNumerals(kpis.completedServices),
      sub: "সফলভাবে সমাপ্ত",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: bn.dashboard.todaySales,
      value: formatBengaliCurrency(kpis.todaySalesMinor),
      sub: "আজকের নগদ ও অনলাইন আদায়",
      icon: DollarSign,
      color: "text-salon-primary bg-salon-primary-50 border-salon-primary-100",
    },
    {
      title: bn.dashboard.monthlySales,
      value: formatBengaliCurrency(kpis.monthlySalesMinor),
      sub: "চলতি মাসের মোট আয়",
      icon: TrendingUp,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      title: bn.dashboard.totalCustomers,
      value: toBengaliNumerals(kpis.totalCustomers),
      sub: "নিবন্ধিত ডাটাবেজ",
      icon: Users,
      color: "text-purple-600 bg-purple-50 border-purple-100",
    },
    {
      title: bn.dashboard.totalStaff,
      value: toBengaliNumerals(kpis.totalStaff),
      sub: "সক্রিয় স্টাইলিস্ট ও কর্মী",
      icon: UserCheck,
      color: "text-teal-600 bg-teal-50 border-teal-100",
    },
    {
      title: bn.dashboard.duePayments,
      value: formatBengaliCurrency(kpis.duePaymentsMinor),
      sub: "বকেয়া বিলের পরিমাণ",
      icon: AlertCircle,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            ড্যাশবোর্ড পর্যবেক্ষণ
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            আজকের সার্বিক সেলুন পরিচালনা ও লাইভ ডেটাবেজ রিপোর্ট
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/book" target="_blank">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন বুকিং</span>
            </Button>
          </Link>
          <Link href="/admin/pos">
            <Button size="sm" className="gap-1.5 text-xs font-bold">
              <CreditCard className="w-3.5 h-3.5" />
              <span>POS বিক্রয় টার্মিনাল</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} className="p-5 border border-gray-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-gray-500">{card.title}</span>
                  <div className="text-2xl font-bold text-gray-900 tracking-tight">
                    {loading ? "..." : card.value}
                  </div>
                  <span className="text-[11px] text-gray-400 block">{card.sub}</span>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Two Column: Recent Appointments & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Appointments Table */}
        <div className="lg:col-span-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900 text-base">আজকের ও সাম্প্রতিক বুকিং</h3>
                <p className="text-xs text-gray-500">অনলাইন ও ওয়াক-ইন অ্যাপয়েন্টমেন্ট তালিকা</p>
              </div>
              <Link
                href="/admin/appointments"
                className="text-xs font-semibold text-salon-primary hover:underline flex items-center gap-1"
              >
                <span>সব দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 font-semibold">
                    <th className="pb-3">রেফারেন্স</th>
                    <th className="pb-3">গ্রাহক</th>
                    <th className="pb-3">সময়</th>
                    <th className="pb-3">স্টাইলিস্ট</th>
                    <th className="pb-3">মূল্য</th>
                    <th className="pb-3">অবস্থা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentAppointments.length > 0 ? (
                    recentAppointments.map((appt) => (
                      <tr key={appt._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 font-mono font-medium text-salon-primary">
                          {appt.bookingReference}
                        </td>
                        <td className="py-3 font-semibold text-gray-900">
                          {appt.customerName}
                          <span className="block text-[10px] text-gray-400 font-normal">
                            {appt.customerPhone}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600">
                          {formatBengaliTime(appt.startTime)}
                        </td>
                        <td className="py-3 text-gray-700">
                          {appt.staffId?.fullName || "যেকোনো কর্মী"}
                        </td>
                        <td className="py-3 font-bold text-gray-900">
                          {formatBengaliCurrency(appt.totalMinor)}
                        </td>
                        <td className="py-3">
                          <Badge variant={appt.bookingStatus as unknown as any} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400">
                        {loading ? "তথ্য লোড হচ্ছে..." : "বর্তমানে কোনো সাম্প্রতিক বুকিং নেই"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Quick Operations & Inventory Warning */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 text-base mb-3">দ্রুত পরিচালনা</h3>
            <div className="space-y-2">
              <Link href="/admin/pos" className="block">
                <div className="p-3 rounded-xl border border-gray-200 hover:border-salon-primary hover:bg-salon-primary-50/50 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-salon-primary-100 text-salon-primary flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">POS ক্যাশিয়ার শুরু করুন</h4>
                      <p className="text-[10px] text-gray-400">বিলিং ও রসিদ তৈরি</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>

              <Link href="/admin/appointments" className="block">
                <div className="p-3 rounded-xl border border-gray-200 hover:border-salon-primary hover:bg-salon-primary-50/50 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <CalendarDays className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">অ্যাপয়েন্টমেন্ট অনুমোদন</h4>
                      <p className="text-[10px] text-gray-400">চেক-ইন ও সার্ভিস পরিচালনা</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>

              <Link href="/admin/inventory" className="block">
                <div className="p-3 rounded-xl border border-gray-200 hover:border-salon-primary hover:bg-salon-primary-50/50 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-800">স্বল্প স্টকের অ্যালার্ট ({toBengaliNumerals(kpis.lowStockCount)})</h4>
                      <p className="text-[10px] text-gray-400">পণ্য পুনঃক্রয় প্রয়োজন</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            </div>
          </Card>

          {/* Business Balance Card */}
          <Card className="p-6 bg-gradient-to-br from-salon-dark to-salon-primary text-white space-y-4">
            <span className="text-xs text-salon-secondary uppercase font-semibold tracking-wider">
              চলতি মাসের অপারেটিং ক্যাশ
            </span>
            <div className="text-3xl font-bold">
              {formatBengaliCurrency(kpis.netOperatingCashMinor)}
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              চলতি মাসের মোট আয় {formatBengaliCurrency(kpis.monthlySalesMinor)} থেকে মোট খরচ {formatBengaliCurrency(kpis.monthlyExpenseMinor)} বাদে নগদ উদ্বৃত্ত।
            </p>
            <div className="pt-2 border-t border-white/10">
              <Link href="/admin/reports" className="text-xs text-salon-secondary font-semibold hover:underline">
                বিস্তারিত রিপোর্ট দেখুন →
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
