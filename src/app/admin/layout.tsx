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
} from "lucide-react";
import { bn } from "@/i18n/bn";

const navItems = [
  { href: "/admin", label: bn.nav.dashboard, icon: LayoutDashboard },
  { href: "/admin/appointments", label: bn.nav.appointments, icon: CalendarDays },
  { href: "/admin/calendar", label: bn.nav.calendar, icon: Calendar },
  { href: "/admin/pos", label: bn.nav.pos, icon: CreditCard },
  { href: "/admin/customers", label: bn.nav.customers, icon: Users },
  { href: "/admin/services", label: bn.nav.services, icon: Sparkles },
  { href: "/admin/staff", label: bn.nav.staff, icon: UserCheck },
  { href: "/admin/attendance", label: bn.nav.attendance, icon: Clock },
  { href: "/admin/inventory", label: bn.nav.inventory, icon: Package },
  { href: "/admin/expenses", label: bn.nav.expenses, icon: Receipt },
  { href: "/admin/reports", label: bn.nav.reports, icon: BarChart3 },
  { href: "/admin/settings", label: bn.nav.settings, icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 shrink-0">
        {/* Brand Header */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-salon-primary text-white flex items-center justify-center shadow-md shadow-salon-primary/20">
            <Scissors className="w-5 h-5 -rotate-45" />
          </div>
          <div>
            <span className="font-bold text-base text-salon-primary block leading-tight">
              সেলুন অ্যাডমিন
            </span>
            <span className="text-[11px] text-salon-muted font-medium">Aulad IT Solution</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-salon-primary text-white shadow-sm font-semibold"
                    : "text-gray-600 hover:bg-salon-primary-50 hover:text-salon-primary"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-salon-primary-100 text-salon-primary flex items-center justify-center font-bold text-xs">
              ম
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">মালিক / অ্যাডমিন</p>
              <p className="text-[10px] text-gray-400">অনলাইন</p>
            </div>
          </div>
          <Link href="/login" className="text-gray-400 hover:text-salon-danger p-1">
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative flex flex-col w-64 bg-white z-10 shadow-2xl">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
              <span className="font-bold text-salon-primary text-base">সেলুন অ্যাডমিন</span>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
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
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                      isActive
                        ? "bg-salon-primary text-white"
                        : "text-gray-600 hover:bg-salon-primary-50"
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
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-gray-800">
              ম্যানেজমেন্ট পোর্টাল
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/pos"
              className="px-3.5 py-1.5 rounded-xl bg-salon-primary text-white text-xs font-semibold hover:bg-salon-primary-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>POS ক্যাশিয়ার</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors hidden sm:inline-block"
            >
              ওয়েবসাইট দেখুন ↗
            </Link>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
