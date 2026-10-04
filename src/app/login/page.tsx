"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scissors, Lock, Mail, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Quick Demo Login for Administrator
  const handleQuickAdminLogin = () => {
    // In production with Firebase, sign-in token is exchanged with /api/auth/sync
    // For direct preview and administrative testing, we navigate to /admin
    setLoading(true);
    setTimeout(() => {
      router.push("/admin");
    }, 600);
  };

  // First time bootstrap trigger
  const handleBootstrapInit = async () => {
    setLoading(true);
    setStatusMessage("সিস্টেম বুটস্ট্র্যাপ যাচাই করা হচ্ছে...");
    try {
      const res = await fetch("/api/admin/bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secretKey: "aulad_it_secure_bootstrap_key_2026" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        setStatusMessage(data.message || "বুটস্ট্র্যাপ সফল হয়েছে!");
      } else {
        setIsSuccess(false);
        setStatusMessage(data.message || "বুটস্ট্র্যাপ ব্যর্থ হয়েছে বা ইতোমধ্যে সম্পন্ন হয়েছে।");
      }
    } catch {
      setStatusMessage("সার্ভারে সংযোগ ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-salon-cream">
      <Card className="w-full max-w-md p-8 shadow-xl border border-salon-primary/10 space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-salon-primary font-bold">
            <div className="w-10 h-10 rounded-xl bg-salon-primary text-white flex items-center justify-center">
              <Scissors className="w-5 h-5 -rotate-45" />
            </div>
            <span className="text-xl">গ্ল্যামার সেলুন ম্যানেজমেন্ট</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-salon-dark pt-2">সিস্টেমে লগইন করুন</h1>
          <p className="text-xs text-salon-muted">
            অ্যাডমিন, ম্যানেজার বা স্টাফ অ্যাকাউন্টে প্রবেশের জন্য তথ্য দিন
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
              isSuccess
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <ShieldAlert className="w-4 h-4 shrink-0" />}
            <span>{statusMessage}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleQuickAdminLogin();
          }}
          className="space-y-4"
        >
          <Input
            label="ইমেইল ঠিকানা"
            type="email"
            placeholder="admin@auladit.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="পাসওয়ার্ড"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Button type="submit" size="lg" isLoading={loading} className="w-full font-bold">
            লগইন করুন
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-salon-primary/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-salon-muted">অথবা সরাসরি টেস্ট অ্যাক্সেস</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleQuickAdminLogin}
            className="w-full font-semibold"
          >
            অ্যাডমিন ড্যাশবোর্ড টেস্ট প্রবেশ
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBootstrapInit}
            className="w-full text-xs text-salon-muted hover:text-salon-primary"
          >
            প্রথমবার অ্যাডমিন বুটস্ট্র্যাপ চালান
          </Button>
        </div>

        <div className="text-center pt-2">
          <Link href="/" className="text-xs text-salon-primary hover:underline font-medium">
            ← মূল ওয়েবসাইটে ফিরে যান
          </Link>
        </div>
      </Card>
    </div>
  );
}
