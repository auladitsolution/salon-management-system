"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatBengaliDate, formatBengaliTime, getDhakaTodayString } from "@/lib/dates/bengaliDate";
import { formatBengaliCurrency } from "@/lib/money/poisha";

interface CalendarAppointment {
  _id: string;
  bookingReference: string;
  customerName: string;
  customerPhone: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  bookingStatus: string;
  totalMinor: number;
  staffId?: { _id: string; fullName: string };
  services: Array<{ name: string }>;
}

interface StaffMember {
  _id: string;
  fullName: string;
  designation: string;
}

export default function CalendarTimelinePage() {
  const [selectedDate, setSelectedDate] = useState(getDhakaTodayString());
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [apptsRes, staffRes] = await Promise.all([
          fetch(`/api/bookings?date=${selectedDate}`).then((r) => r.json()),
          fetch("/api/staff").then((r) => r.json()),
        ]);
        if (apptsRes.success) setAppointments(apptsRes.data);
        if (staffRes.success) setStaffList(staffRes.data);
      } catch (err) {
        console.error("Calendar fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">দৈনিক সিডিউল ও টাইমলাইন</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            স্টাফ টাইমলাইন ক্যালেন্ডার
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            স্টাইলিস্টভিত্তিক লাইভ বুকিং মনিটরিং ও কর্মঘণ্টা শিডিউল
          </p>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-2.5">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-bold text-white focus:outline-none focus:border-sky-500"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedDate(getDhakaTodayString())}
            className="text-xs font-bold border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800"
          >
            আজকের দিন
          </Button>
        </div>
      </div>

      {/* Date Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-xl shadow-sky-600/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-black">{formatBengaliDate(selectedDate)}</h3>
            <p className="text-xs text-sky-100 font-medium">মোট শিডিউলকৃত অ্যাপয়েন্টমেন্ট: {appointments.length} টি</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>লাইভ টাইমলাইন</span>
        </div>
      </div>

      {/* Staff-wise Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {staffList.map((staff) => {
          const staffAppts = appointments.filter(
            (a) => a.staffId?._id?.toString() === staff._id.toString()
          );

          return (
            <div key={staff._id} className="p-5 rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                  {staff.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{staff.fullName}</h4>
                  <p className="text-[11px] text-sky-400 font-semibold">{staff.designation}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {staffAppts.length > 0 ? (
                  staffAppts.map((appt) => (
                    <div
                      key={appt._id}
                      className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-100">
                          {appt.customerName}
                        </span>
                        <Badge variant={appt.bookingStatus as unknown as any} />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 font-semibold text-rose-400">
                          <Clock className="w-3 h-3" />
                          {formatBengaliTime(appt.startTime)} - {formatBengaliTime(appt.endTime)}
                        </span>
                        <span className="font-bold text-amber-400">
                          {formatBengaliCurrency(appt.totalMinor)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        সার্ভিস: {appt.services.map((s) => s.name).join(", ")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-xs text-slate-500 bg-slate-900/40 rounded-2xl font-medium">
                    এই দিনে কোনো অ্যাপয়েন্টমেন্ট নির্ধারিত নেই
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
