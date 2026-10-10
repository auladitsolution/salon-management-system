"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Scissors, Calendar, User, Menu, X, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  salonName?: string;
  phone?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  salonName = "গ্ল্যামার লাউঞ্জ ও সেলুন",
  phone = "01700000000",
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "হোম" },
    { href: "/services", label: "সার্ভিসসমূহ" },
    { href: "/team", label: "আমাদের টিম" },
    { href: "/gallery", label: "গ্যালারি" },
    { href: "/contact", label: "যোগাযোগ" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-rose-100/70 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Salon Brand */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-salon-primary-800 via-salon-primary to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-salon-primary/30 group-hover:scale-105 group-hover:shadow-glow transition-all duration-300">
                <Scissors className="w-5 h-5 transform -rotate-45" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gradient-primary block leading-tight">
                {salonName}
              </span>
              <span className="text-[11px] text-salon-muted font-semibold tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                <span>প্রিমিয়াম বিউটি ও সেলুন</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-rose-50/80 border border-rose-100 text-sm font-semibold">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-white text-salon-primary shadow-sm font-bold"
                      : "text-gray-700 hover:text-salon-primary hover:bg-white/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-bold transition-all border border-emerald-200/70"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{phone}</span>
            </a>

            <Link href="/book">
              <Button variant="primary" size="md" className="gap-2 shadow-glow">
                <Calendar className="w-4 h-4" />
                <span>অ্যাপয়েন্টমেন্ট নিন</span>
              </Button>
            </Link>

            <Link href="/admin">
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm">
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span>ড্যাশবোর্ড</span>
              </button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/book">
              <Button size="sm" variant="primary">
                <span>বুকিং</span>
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl text-salon-dark bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-salon-primary" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-rose-50 text-salon-primary font-bold"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-rose-100 space-y-2">
            <a
              href={`tel:${phone}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-emerald-50 text-emerald-800 font-bold text-sm border border-emerald-200"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>কল করুন: {phone}</span>
            </a>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  অ্যাপয়েন্টমেন্ট
                </Button>
              </Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-1.5">
                  <User className="w-4 h-4 text-rose-400" />
                  <span>অ্যাডমিন</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
