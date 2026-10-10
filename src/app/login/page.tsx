"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Scissors, Lock, Mail, ShieldAlert, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
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
    setLoading(true);
    setTimeout(() => {
      router.push("/admin");
    }, 400);
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
        setStatusMessage(data.message || "বুটস্ট্র্যাপ ইতোমধ্যে সম্পন্ন হয়েছে।");
      }
    } catch {
      setStatusMessage("সার্ভারে সংযোগ ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-mesh-salon relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md p-8 rounded-3xl bg-white/95 backdrop-blur-2xl border border-rose-100/90 shadow-2xl space-y-6 relative z-10">
        <div className="text-center space-y-2.5">
          <Link href="/" className="inline-flex items-center gap-3 text-salon-primary font-bold group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 via-salon-primary to-purple-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <Scissors className="w-6 h-6 -rotate-45" />
            </div>
            <div className="text-left">
              <span className="text-lg font-black text-slate-900 block leading-tight">গ্ল্যামার সেলুন</span>
              <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">ম্যানেজমেন্ট পোর্টাল</span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 pt-2 tracking-tight">সিস্টেমে লগইন করুন</h1>
          <p className="text-xs text-slate-500">
            অ্যাডমিন, ক্যাশিয়ার বা ম্যানেজার অ্যাকাউন্টে প্রবেশের তথ্য দিন
          </p>
        </div>

        {statusMessage && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold flex items-start gap-2.5 ${
              isSuccess
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-amber-50 text-amber-800 border border-amber-200"
            }`}
          >
            {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />}
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
            label="ইমেইল অ্যাড্রেস"
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

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full gap-2 font-bold shadow-glow"
            >
              <span>লগইন করুন</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-rose-100 space-y-3">
          <Button
            type="button"
            variant="gold"
            size="md"
            onClick={handleQuickAdminLogin}
            className="w-full font-black text-slate-950"
          >
            <Sparkles className="w-4 h-4" />
            <span>সরাসরি ডেমো অ্যাডমিন এক্সেস</span>
          </Button>

          <button
            type="button"
            onClick={handleBootstrapInit}
            className="w-full text-center text-[11px] text-slate-500 hover:text-rose-600 font-semibold"
          >
            প্রথমবার ডাটাবেজ বুটস্ট্র্যাপ রান করতে এখানে ক্লিক করুন
          </button>
        </div>
      </div>
    </div>
  );
}
