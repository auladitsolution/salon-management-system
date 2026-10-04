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
} from "lucide-react";
import { Card } from "@/components/ui/Card";
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
        setActionMessage(`রেফারেন্স ${reference} এর অবস্থা সফলভাবে পরিবর্তিত হয়েছে।`);
        loadAppointments();
      } else {
        alert(data.message || "অবস্থা পরিবর্তনে সমস্যা হয়েছে");
      }
    } catch {
      alert("সার্ভার সংযোগ সমস্যা");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            অ্যাপয়েন্টমেন্ট ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            সকল অনলাইন ও অফলাইন বুকিং নিয়ন্ত্রণ, চেক-ইন এবং স্ট্যাটাস ট্রানজিশন
          </p>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage("")} className="font-bold">×</button>
        </div>
      )}

      {/* Filter Toolbar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="গ্রাহকের নাম, মোবাইল বা কোড..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadAppointments()}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-salon-primary"
            />
          </div>

          {/* Date Filter */}
          <div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-salon-primary"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-1 focus:ring-salon-primary"
            >
              <option value="">সকল স্ট্যাটাস</option>
              <option value="pending">অপেক্ষমাণ (Pending)</option>
              <option value="confirmed">নিশ্চিতকৃত (Confirmed)</option>
              <option value="checked_in">উপস্থিত (Checked In)</option>
              <option value="in_progress">সার্ভিস চলছে (In Progress)</option>
              <option value="completed">সম্পন্ন (Completed)</option>
              <option value="cancelled">বাতিল (Cancelled)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={loadAppointments} className="w-full text-xs">
              ফিল্টার প্রয়োগ
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterDate("");
                setFilterStatus("");
                setSearchQuery("");
              }}
              className="text-xs"
            >
              রিসেট
            </Button>
          </div>
        </div>
      </Card>

      {/* Appointments Data Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
              <tr>
                <th className="py-3 px-4">রেফারেন্স</th>
                <th className="py-3 px-4">গ্রাহকের নাম ও ফোন</th>
                <th className="py-3 px-4">তারিখ ও সময়</th>
                <th className="py-3 px-4">সার্ভিসসমূহ</th>
                <th className="py-3 px-4">স্টাইলিস্ট</th>
                <th className="py-3 px-4">মোট বিল</th>
                <th className="py-3 px-4">অবস্থা</th>
                <th className="py-3 px-4 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr key={appt._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-salon-primary">
                      {appt.bookingReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">{appt.customerName}</span>
                      <span className="text-[11px] text-gray-500">{appt.customerPhone}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-gray-900 block font-medium">
                        {formatBengaliDate(appt.appointmentDate)}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {formatBengaliTime(appt.startTime)} - {formatBengaliTime(appt.endTime)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        {appt.services.map((s, idx) => (
                          <span key={idx} className="block text-[11px] text-gray-700">
                            • {s.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      {appt.staffId?.fullName || "যেকোনো কর্মী"}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {formatBengaliCurrency(appt.totalMinor)}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge variant={appt.bookingStatus as unknown as any} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {/* State Transition Actions */}
                      <div className="flex items-center justify-end gap-1.5">
                        {appt.bookingStatus === "pending" && (
                          <>
                            <button
                              title="নিশ্চিত করুন"
                              onClick={() => updateStatus(appt.bookingReference, "confirmed")}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              title="বাতিল করুন"
                              onClick={() => updateStatus(appt.bookingReference, "cancelled")}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {appt.bookingStatus === "confirmed" && (
                          <>
                            <button
                              title="চেক-ইন করুন"
                              onClick={() => updateStatus(appt.bookingReference, "checked_in")}
                              className="px-2 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-[10px]"
                            >
                              চেক-ইন
                            </button>
                            <button
                              title="অনুপস্থিত"
                              onClick={() => updateStatus(appt.bookingReference, "no_show")}
                              className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-[10px]"
                            >
                              No-Show
                            </button>
                          </>
                        )}

                        {appt.bookingStatus === "checked_in" && (
                          <button
                            title="সার্ভিস শুরু"
                            onClick={() => updateStatus(appt.bookingReference, "in_progress")}
                            className="px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-[10px] flex items-center gap-1"
                          >
                            <Play className="w-3 h-3" />
                            <span>সার্ভিস শুরু</span>
                          </button>
                        )}

                        {appt.bookingStatus === "in_progress" && (
                          <button
                            title="সম্পন্ন করুন"
                            onClick={() => updateStatus(appt.bookingReference, "completed")}
                            className="px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-[10px]"
                          >
                            সম্পন্ন করুন
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-gray-400">
                    {loading ? "তথ্য লোড হচ্ছে..." : "কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি।"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
