"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Scissors,
  LayoutDashboard,
  CalendarDays,
  Calendar,
  CreditCard,
  Users,
  Sparkles,
  UserCheck,
  Package,
  Receipt,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { bn } from "@/i18n/bn";

const navItems = [
  { href: "/admin", label: bn.nav.dashboard, icon: LayoutDashboard, color: "text-violet-400 group-hover:text-violet-300" },
  { href: "/admin/appointments", label: bn.nav.appointments, icon: CalendarDays, color: "text-rose-400 group-hover:text-rose-300" },
  { href: "/admin/calendar", label: bn.nav.calendar, icon: Calendar, color: "text-sky-400 group-hover:text-sky-300" },
  { href: "/admin/pos", label: bn.nav.pos, icon: CreditCard, color: "text-amber-400 group-hover:text-amber-300", badge: "ক্যাশিয়ার" },
  { href: "/admin/customers", label: bn.nav.customers, icon: Users, color: "text-emerald-400 group-hover:text-emerald-300" },
  { href: "/admin/services", label: bn.nav.services, icon: Sparkles, color: "text-fuchsia-400 group-hover:text-fuchsia-300" },
  { href: "/admin/staff", label: bn.nav.staff, icon: UserCheck, color: "text-blue-400 group-hover:text-blue-300" },
  { href: "/admin/attendance", label: bn.nav.attendance, icon: Clock, color: "text-teal-400 group-hover:text-teal-300" },
  { href: "/admin/inventory", label: bn.nav.inventory, icon: Package, color: "text-purple-400 group-hover:text-purple-300" },
  { href: "/admin/expenses", label: bn.nav.expenses, icon: Receipt, color: "text-orange-400 group-hover:text-orange-300" },
  { href: "/admin/reports", label: bn.nav.reports, icon: BarChart3, color: "text-indigo-400 group-hover:text-indigo-300" },
  { href: "/admin/settings", label: bn.nav.settings, icon: Settings, color: "text-slate-400 group-hover:text-slate-300" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 shrink-0">
        {/* Brand Header */}
        <div className="h-20 flex items-center gap-3.5 px-6 border-b border-slate-800/80">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 via-salon-primary to-purple-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-white block leading-tight">
              সেলুন অ্যাডমিন
            </span>
            <span className="text-[11px] text-rose-400 font-semibold tracking-wide">ম্যানেজমেন্ট পোর্টাল</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-rose-600 via-salon-primary to-purple-600 text-white shadow-lg shadow-rose-600/25 scale-[1.02]"
                    : "text-slate-400 hover:text-white hover:bg-slate-900/90"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? "bg-white/20 text-white" : `bg-slate-900 ${item.color}`
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && !isActive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800/80 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                ম
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-100">মালিক / সুপার অ্যাডমিন</p>
              <p className="text-[10px] text-emerald-400 font-semibold">সিস্টেমে অনলাইন</p>
            </div>
          </div>
          <Link
            href="/login"
            title="লগআউট"
            className="text-slate-400 hover:text-rose-400 p-2 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex flex-col w-72 bg-slate-950 border-r border-slate-800 z-10 shadow-2xl">
            <div className="h-18 flex items-center justify-between px-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-purple-600 text-white flex items-center justify-center">
                  <Scissors className="w-4 h-4" />
                </div>
                <span className="font-bold text-white text-base">সেলুন অ্যাডমিন</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold ${
                      isActive
                        ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 text-slate-100">
        {/* Top Navbar */}
        <header className="h-18 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-2xl bg-slate-900 text-slate-300 hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                স্মার্ট সেলুন অপারেটিং সিস্টেম
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/pos"
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 hover:shadow-glow-gold flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>POS ক্যাশিয়ার</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-700/80 transition-all hidden sm:flex items-center gap-1.5"
            >
              <span>ওয়েবসাইট প্রিভিউ</span>
              <ExternalLink className="w-3.5 h-3.5 text-rose-400" />
            </Link>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto bg-slate-900 text-slate-100">
          {children}
        </main>
      </div>
    </div>
  );
}
