"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  CalendarDays,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  UserCheck,
  CreditCard,
  AlertCircle,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatBengaliCurrency, toBengaliNumerals } from "@/lib/money/poisha";
import { formatBengaliDate, formatBengaliTime, getDhakaTodayString } from "@/lib/dates/bengaliDate";
import { bn } from "@/i18n/bn";

interface AppointmentRecord {
  _id: string;
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  totalDurationMinutes: number;
  totalMinor: number;
  bookingStatus: string;
  paymentStatus: string;
  staffId?: { fullName: string; designation: string };
  services: Array<{ name: string; priceMinor: number }>;
}

export default function AppointmentsManagementPage() {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.set("date", filterDate);
      if (filterStatus) params.set("status", filterStatus);
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/bookings?${params.toString()}`).then((r) => r.json());
      if (res.success) {
        setAppointments(res.data);
      }
    } catch (err) {
      console.error("Appointments load error:", err);
    } finally {
      setLoading(false);
    }
  }, [filterDate, filterStatus, searchQuery]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const updateStatus = async (reference: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionMessage(`রেফারেন্স ${reference} এর অবস্থা সফলভাবে "${nextStatus}" এ পরিবর্তিত হয়েছে।`);
        loadAppointments();
      } else {
        alert(data.message || "অবস্থা পরিবর্তনে সমস্যা হয়েছে");
      }
    } catch {
      alert("সার্ভার সংযোগ সমস্যা");
    }
  };

  const statusShortcuts = [
    { label: "সকল", value: "", count: appointments.length },
    { label: "অপেক্ষমাণ", value: "pending", color: "text-amber-400 border-amber-500/30" },
    { label: "নিশ্চিত", value: "confirmed", color: "text-sky-400 border-sky-500/30" },
    { label: "উপস্থিত", value: "checked_in", color: "text-purple-400 border-purple-500/30" },
    { label: "চলমান", value: "in_progress", color: "text-indigo-400 border-indigo-500/30" },
    { label: "সম্পন্ন", value: "completed", color: "text-emerald-400 border-emerald-500/30" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">বুকিং কন্ট্রোল প্যানেল</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            সকল অনলাইন ও সরাসরি বুকিং ট্র্যাকিং, লাইভ চেক-ইন এবং সার্ভিস স্ট্যাটাস নিয়ন্ত্রণ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={loadAppointments}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
          >
            হালনাগাদ করুন
          </Button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-lg shadow-emerald-500/5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button onClick={() => setActionMessage("")} className="text-emerald-400 hover:text-white font-black text-base px-1">×</button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-xl space-y-4">
        {/* Quick Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {statusShortcuts.map((shortcut) => {
            const isActive = filterStatus === shortcut.value;
            return (
              <button
                key={shortcut.value}
                onClick={() => setFilterStatus(shortcut.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white border-rose-500 shadow-md shadow-rose-600/20"
                    : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-900"
                }`}
              >
                {shortcut.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="গ্রাহকের নাম, মোবাইল নম্বর বা রেফারেন্স কোড..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadAppointments()}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Date Filter */}
          <div className="sm:col-span-3">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Actions */}
          <div className="sm:col-span-4 flex gap-2">
            <Button size="sm" onClick={loadAppointments} variant="primary" className="flex-1 text-xs font-bold">
              সার্চ করুন
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterDate("");
                setFilterStatus("");
                setSearchQuery("");
              }}
              className="text-xs border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
            >
              রিসেট
            </Button>
          </div>
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold">
              <tr>
                <th className="py-3.5 px-4">রেফারেন্স</th>
                <th className="py-3.5 px-4">গ্রাহক তথ্য</th>
                <th className="py-3.5 px-4">তারিখ ও সময়</th>
                <th className="py-3.5 px-4">সার্ভিস তালিকা</th>
                <th className="py-3.5 px-4">স্টাইলিস্ট</th>
                <th className="py-3.5 px-4">বিল</th>
                <th className="py-3.5 px-4">স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-rose-400">
                      {appt.bookingReference}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500/20 to-purple-500/20 text-rose-300 flex items-center justify-center font-bold text-xs border border-rose-500/20 shrink-0">
                          {appt.customerName ? appt.customerName.charAt(0) : "U"}
                        </div>
                        <div>
                          <span className="font-bold text-slate-100 block">{appt.customerName}</span>
                          <span className="text-[11px] text-slate-400 font-medium">{appt.customerPhone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-slate-200 block font-bold">
                        {formatBengaliDate(appt.appointmentDate)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-semibold">
                        {formatBengaliTime(appt.startTime)} - {formatBengaliTime(appt.endTime)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {appt.services.map((s, idx) => (
                          <span key={idx} className="inline-block px-2 py-0.5 rounded-lg bg-slate-900 text-[10px] font-semibold text-slate-300 border border-slate-800 mr-1 mb-0.5">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-300 font-medium">
                      {appt.staffId?.fullName ? (
                        <span className="px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold">
                          {appt.staffId.fullName}
                        </span>
                      ) : (
                        <span className="text-slate-500">যেকোনো কর্মী</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-black text-amber-400 text-sm">
                      {formatBengaliCurrency(appt.totalMinor)}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={appt.bookingStatus as unknown as any} />
                    </td>
                    <td className="py-4 px-4 text-right">
                      {/* State Transition Actions */}
                      <div className="flex items-center justify-end gap-1.5">
                        {appt.bookingStatus === "pending" && (
                          <>
                            <button
                              title="বুকিং নিশ্চিত করুন"
                              onClick={() => updateStatus(appt.bookingReference, "confirmed")}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 transition-all font-bold text-xs flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>নিশ্চিত</span>
                            </button>
                            <button
                              title="বুকিং বাতিল করুন"
                              onClick={() => updateStatus(appt.bookingReference, "cancelled")}
                              className="p-1.5 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white border border-rose-500/30 transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {appt.bookingStatus === "confirmed" && (
                          <>
                            <button
                              title="গ্রাহক সেলুনে উপস্থিত হয়েছে"
                              onClick={() => updateStatus(appt.bookingReference, "checked_in")}
                              className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 hover:bg-purple-600 hover:text-white border border-purple-500/30 font-bold text-xs transition-all"
                            >
                              চেক-ইন
                            </button>
                            <button
                              title="অনুপস্থিত"
                              onClick={() => updateStatus(appt.bookingReference, "no_show")}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:bg-slate-700 text-xs font-semibold"
                            >
                              No-Show
                            </button>
                          </>
                        )}

                        {appt.bookingStatus === "checked_in" && (
                          <button
                            title="সার্ভিস শুরু করুন"
                            onClick={() => updateStatus(appt.bookingReference, "in_progress")}
                            className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-600 hover:text-white border border-indigo-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>সার্ভিস শুরু</span>
                          </button>
                        )}

                        {appt.bookingStatus === "in_progress" && (
                          <button
                            title="সার্ভিস সমাপ্ত"
                            onClick={() => updateStatus(appt.bookingReference, "completed")}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-md shadow-emerald-500/20 hover:from-emerald-600 hover:to-teal-700 transition-all"
                          >
                            সম্পন্ন করুন
                          </button>
                        )}

                        {appt.bookingStatus === "completed" && (
                          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> সমাপ্ত
                          </span>
                        )}

                        {appt.bookingStatus === "cancelled" && (
                          <span className="text-[11px] text-rose-400 font-bold">বাতিলকৃত</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500 font-semibold">
                    {loading ? "তথ্য লোড হচ্ছে..." : "কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
