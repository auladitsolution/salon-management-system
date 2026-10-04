"use client";

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            অ্যাপয়েন্টমেন্ট ক্যালেন্ডার ও টাইমলাইন
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            দৈনিক স্টাইলিস্ট-ভিত্তিক বুকিং সিডিউল ও কর্মঘণ্টা মনিটরিং
          </p>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold focus:ring-1 focus:ring-salon-primary"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedDate(getDhakaTodayString())}
            className="text-xs"
          >
            আজকের দিন
          </Button>
        </div>
      </div>

      {/* Date Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-salon-primary to-salon-primary-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-salon-secondary" />
          <div>
            <h3 className="text-base font-bold">{formatBengaliDate(selectedDate)}</h3>
            <p className="text-xs text-gray-200">মোট শিডিউলকৃত অ্যাপয়েন্টমেন্ট: {appointments.length} টি</p>
          </div>
        </div>
      </div>

      {/* Staff-wise Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {staffList.map((staff) => {
          const staffAppts = appointments.filter(
            (a) => a.staffId?._id?.toString() === staff._id.toString()
          );

          return (
            <Card key={staff._id} className="p-5 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-salon-primary-100 text-salon-primary flex items-center justify-center font-bold text-sm">
                  {staff.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{staff.fullName}</h4>
                  <p className="text-[11px] text-gray-500">{staff.designation}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {staffAppts.length > 0 ? (
                  staffAppts.map((appt) => (
                    <div
                      key={appt._id}
                      className="p-3 rounded-xl bg-gray-50 border border-gray-100 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">
                          {appt.customerName}
                        </span>
                        <Badge variant={appt.bookingStatus as unknown as any} />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-salon-primary" />
                          {formatBengaliTime(appt.startTime)} - {formatBengaliTime(appt.endTime)}
                        </span>
                        <span className="font-bold text-gray-800">
                          {formatBengaliCurrency(appt.totalMinor)}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        সার্ভিস: {appt.services.map((s) => s.name).join(", ")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-6 text-xs text-gray-400 bg-gray-50/50 rounded-xl">
                    এই দিনে কোনো বুকিং নেই
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
