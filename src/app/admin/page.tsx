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
  Wallet,
  Activity,
  ArrowUpRight,
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
      sub: "আজকের মোট শিডিউল",
      icon: CalendarDays,
      gradient: "from-blue-500 to-cyan-500",
      shadow: "shadow-blue-500/20",
    },
    {
      title: bn.dashboard.pendingBookings,
      value: toBengaliNumerals(kpis.pendingBookings),
      sub: "অনুমোদনের অপেক্ষায়",
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/20",
    },
    {
      title: bn.dashboard.completedServices,
      value: toBengaliNumerals(kpis.completedServices),
      sub: "সফলভাবে সমাপ্ত",
      icon: CheckCircle2,
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/20",
    },
    {
      title: bn.dashboard.todaySales,
      value: formatBengaliCurrency(kpis.todaySalesMinor),
      sub: "আজকের নগদ ও ডিজিটাল আদায়",
      icon: DollarSign,
      gradient: "from-rose-500 to-pink-600",
      shadow: "shadow-rose-500/20",
    },
    {
      title: bn.dashboard.monthlySales,
      value: formatBengaliCurrency(kpis.monthlySalesMinor),
      sub: "চলতি মাসের মোট টার্নওভার",
      icon: TrendingUp,
      gradient: "from-purple-500 to-indigo-600",
      shadow: "shadow-purple-500/20",
    },
    {
      title: bn.dashboard.totalCustomers,
      value: toBengaliNumerals(kpis.totalCustomers),
      sub: "নিবন্ধিত সক্রিয় গ্রাহক",
      icon: Users,
      gradient: "from-fuchsia-500 to-pink-500",
      shadow: "shadow-fuchsia-500/20",
    },
    {
      title: bn.dashboard.totalStaff,
      value: toBengaliNumerals(kpis.totalStaff),
      sub: "কর্মরত স্টাইলিস্ট ও কর্মী",
      icon: UserCheck,
      gradient: "from-teal-500 to-emerald-600",
      shadow: "shadow-teal-500/20",
    },
    {
      title: bn.dashboard.duePayments,
      value: formatBengaliCurrency(kpis.duePaymentsMinor),
      sub: "মোট বকেয়া বিল",
      icon: AlertCircle,
      gradient: "from-red-500 to-rose-600",
      shadow: "shadow-red-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">রিয়েল-টাইম ড্যাশবোর্ড</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            সেলুন ওভারভিউ ও লাইভ স্ট্যাটাস
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            আজকের সার্বিক বুকিং, পেমেন্ট, ক্যাশফ্লো এবং স্টাফ ম্যানেজমেন্ট
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/book" target="_blank">
            <Button size="sm" variant="outline" className="gap-2 text-xs border-slate-700 bg-slate-800/80 text-slate-200 hover:text-white hover:bg-slate-700">
              <Plus className="w-4 h-4 text-rose-400" />
              <span>নতুন বুকিং গ্রহণ</span>
            </Button>
          </Link>
          <Link href="/admin/pos">
            <Button size="sm" variant="gold" className="gap-2 text-xs font-bold text-slate-950">
              <CreditCard className="w-4 h-4" />
              <span>POS ক্যাশিয়ার শুরু</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 8 Primary Colorful KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-lg hover:border-slate-700 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-400">{card.title}</span>
                  <div className="text-2xl font-black text-white tracking-tight">
                    {loading ? "..." : card.value}
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold block">{card.sub}</span>
                </div>
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${card.gradient} text-white flex items-center justify-center shadow-lg ${card.shadow} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Columns: Recent Bookings & Quick Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Recent Appointments Table */}
        <div className="lg:col-span-8">
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-extrabold text-white text-base">সাম্প্রতিক ও আজকের বুকিং তালিকা</h3>
                <p className="text-xs text-slate-400">অনলাইন ও ওয়াক-ইন অ্যাপয়েন্টমেন্টের লাইভ হালনাগাদ</p>
              </div>
              <Link
                href="/admin/appointments"
                className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
              >
                <span>সকল বুকিং দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold">
                    <th className="pb-3">রেফারেন্স</th>
                    <th className="pb-3">গ্রাহক</th>
                    <th className="pb-3">সময়সূচি</th>
                    <th className="pb-3">স্টাইলিস্ট</th>
                    <th className="pb-3">বিল</th>
                    <th className="pb-3">অবস্থা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentAppointments.length > 0 ? (
                    recentAppointments.map((appt) => (
                      <tr key={appt._id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="py-3.5 font-mono font-bold text-rose-400">
                          {appt.bookingReference}
                        </td>
                        <td className="py-3.5">
                          <span className="font-bold text-slate-100 block">{appt.customerName}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{appt.customerPhone}</span>
                        </td>
                        <td className="py-3.5 text-slate-300 font-medium">
                          {formatBengaliTime(appt.startTime)}
                        </td>
                        <td className="py-3.5 text-slate-300">
                          {appt.staffId?.fullName || "যেকোনো কর্মী"}
                        </td>
                        <td className="py-3.5 font-black text-amber-400">
                          {formatBengaliCurrency(appt.totalMinor)}
                        </td>
                        <td className="py-3.5">
                          <Badge variant={appt.bookingStatus as unknown as any} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-500 font-medium">
                        {loading ? "তথ্য লোড হচ্ছে..." : "বর্তমানে কোনো সাম্প্রতিক বুকিং নেই"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Operations & Business Cashflow Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-xl space-y-3.5">
            <h3 className="font-extrabold text-white text-base">দ্রুত এক্সেস</h3>
            
            <div className="space-y-2.5">
              <Link href="/admin/pos" className="block group">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 group-hover:border-amber-500/60 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center font-bold">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors">POS ক্যাশিয়ার টার্মিনাল</h4>
                      <p className="text-[10px] text-slate-400">দ্রুত বিলিং ও রসিদ প্রিন্ট</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>

              <Link href="/admin/appointments" className="block group">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 group-hover:border-rose-500/60 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 text-white flex items-center justify-center">
                      <CalendarDays className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-rose-400 transition-colors">অ্যাপয়েন্টমেন্ট অনুমোদন</h4>
                      <p className="text-[10px] text-slate-400">চেক-ইন ও স্ট্যাটাস আপডেট</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>

              <Link href="/admin/inventory" className="block group">
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 group-hover:border-amber-500/60 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">স্বল্প স্টকের অ্যালার্ট ({toBengaliNumerals(kpis.lowStockCount)})</h4>
                      <p className="text-[10px] text-slate-400">পণ্য পুনঃক্রয় প্রয়োজন</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </Link>
            </div>
          </div>

          {/* Operating Balance Card */}
          <div className="relative rounded-3xl overflow-hidden p-6 bg-gradient-to-br from-rose-950 via-slate-950 to-purple-950 border border-rose-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-300 uppercase font-black tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-400" />
                <span>চলতি মাসের অপারেটিং ক্যাশ</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <div className="text-3xl font-black text-white tracking-tight">
              {formatBengaliCurrency(kpis.netOperatingCashMinor)}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              চলতি মাসের মোট আয় {formatBengaliCurrency(kpis.monthlySalesMinor)} থেকে খরচ {formatBengaliCurrency(kpis.monthlyExpenseMinor)} বাদ দিয়ে নিট পরিচালন উদ্বৃত্ত।
            </p>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <Link href="/admin/reports" className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1">
                <span>পূর্ণাঙ্গ আর্থিক প্রতিবেদন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
