"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Clock, CheckCircle2, UserCheck, Calendar as CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getDhakaTodayString, formatBengaliDate, formatBengaliTime } from "@/lib/dates/bengaliDate";

interface AttendanceRecord {
  _id: string;
  staffId: { _id: string; fullName: string; designation: string };
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
  notes?: string;
}

interface StaffMember {
  _id: string;
  fullName: string;
  designation: string;
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(getDhakaTodayString());
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [attRes, staffRes] = await Promise.all([
        fetch(`/api/staff/attendance?date=${selectedDate}`).then((r) => r.json()),
        fetch("/api/staff").then((r) => r.json()),
      ]);
      if (attRes.success) setAttendance(attRes.data);
      if (staffRes.success) setStaffList(staffRes.data);
    } catch (err) {
      console.error("Attendance fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRecordAttendance = async (staffId: string, status: string) => {
    try {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

      const res = await fetch("/api/staff/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId,
          date: selectedDate,
          checkInTime: status === "present" ? timeStr : undefined,
          status,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("উপস্থিতি রেকর্ড আপডেট হয়েছে!");
        loadData();
      }
    } catch {
      alert("উপস্থিতি সংরক্ষণে ত্রুটি");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            কর্মচারী দৈনিক উপস্থিতি ও ছুটি
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            স্টাফদের দৈনিক চেক-ইন, চেক-আউট ও ছুটির হিসাব
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-1 focus:ring-salon-primary"
          />
        </div>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="font-bold">×</button>
        </div>
      )}

      {/* Attendance Grid */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
              <tr>
                <th className="py-3 px-4">কর্মচারীর নাম</th>
                <th className="py-3 px-4">পদবী</th>
                <th className="py-3 px-4">চেক-ইন সময়</th>
                <th className="py-3 px-4">চেক-আউট সময়</th>
                <th className="py-3 px-4">অবস্থা</th>
                <th className="py-3 px-4 text-right">উপস্থিতি চিহ্নিত করুন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staffList.map((st) => {
                const record = attendance.find(
                  (a) => a.staffId?._id?.toString() === st._id.toString()
                );

                return (
                  <tr key={st._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {st.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {st.designation}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      {record?.checkInTime ? formatBengaliTime(record.checkInTime) : "—"}
                    </td>
                    <td className="py-3.5 px-4 text-gray-700">
                      {record?.checkOutTime ? formatBengaliTime(record.checkOutTime) : "—"}
                    </td>
                    <td className="py-3.5 px-4">
                      {record ? (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          record.status === "present"
                            ? "bg-emerald-100 text-emerald-800"
                            : record.status === "late"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {record.status === "present" ? "উপস্থিত" : record.status === "late" ? "দেরি" : "অনুপস্থিত"}
                        </span>
                      ) : (
                        <span className="text-gray-400">রেকর্ড নেই</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleRecordAttendance(st._id, "present")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[11px]"
                        >
                          উপস্থিত
                        </button>
                        <button
                          onClick={() => handleRecordAttendance(st._id, "late")}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 font-semibold text-[11px]"
                        >
                          দেরি
                        </button>
                        <button
                          onClick={() => handleRecordAttendance(st._id, "absent")}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-[11px]"
                        >
                          অনুপস্থিত
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
