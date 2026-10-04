"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scissors, Calendar, User, Menu, X, Phone } from "lucide-react";
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

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-salon-primary/10 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Salon Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-salon-primary to-salon-primary-700 flex items-center justify-center text-white shadow-md shadow-salon-primary/20 group-hover:scale-105 transition-transform">
              <Scissors className="w-6 h-6 transform -rotate-45" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-salon-primary block leading-none">
                {salonName}
              </span>
              <span className="text-xs text-salon-muted font-medium tracking-wide">
                Aulad IT সলিউশন
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-salon-dark">
            <Link href="/" className="hover:text-salon-primary transition-colors">
              হোম
            </Link>
            <Link href="/services" className="hover:text-salon-primary transition-colors">
              সার্ভিসসমূহ
            </Link>
            <Link href="/team" className="hover:text-salon-primary transition-colors">
              আমাদের টিম
            </Link>
            <Link href="/gallery" className="hover:text-salon-primary transition-colors">
              গ্যালারি
            </Link>
            <Link href="/contact" className="hover:text-salon-primary transition-colors">
              যোগাযোগ
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-sm font-medium text-salon-primary hover:text-salon-primary-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </a>

            <Link href="/book">
              <Button size="md" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span>অ্যাপয়েন্টমেন্ট নিন</span>
              </Button>
            </Link>

            <Link href="/admin">
              <Button variant="outline" size="md" className="gap-1.5">
                <User className="w-4 h-4" />
                <span>ড্যাশবোর্ড</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/book">
              <Button size="sm">
                <span>বুকিং</span>
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-salon-dark hover:bg-salon-primary-50"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-salon-primary/10 bg-white/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-salon-primary-50"
          >
            হোম
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-salon-primary-50"
          >
            সার্ভিসসমূহ
          </Link>
          <Link
            href="/team"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-salon-primary-50"
          >
            আমাদের টিম
          </Link>
          <Link
            href="/gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-salon-primary-50"
          >
            গ্যালারি
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-salon-primary-50"
          >
            যোগাযোগ
          </Link>
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-salon-primary hover:bg-salon-primary-50"
          >
            অ্যাডমিন ড্যাশবোর্ড
          </Link>
        </div>
      )}
    </header>
  );
};
