"use client";

import React, { useState, useEffect } from "react";
import { UserCheck, Plus, Phone, Mail, Award, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { toBengaliNumerals } from "@/lib/money/poisha";

interface StaffItem {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  designation: string;
  specialization: string[];
  shiftStart: string;
  shiftEnd: string;
  commissionType: string;
  commissionValue: number;
  isActive: boolean;
}

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form inputs
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [commissionValue, setCommissionValue] = useState("10");

  const loadStaff = async () => {
    try {
      const res = await fetch("/api/staff").then((r) => r.json());
      if (res.success) setStaffList(res.data);
    } catch (err) {
      console.error("Staff load error:", err);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          designation,
          commissionType: "percentage",
          commissionValue: parseFloat(commissionValue),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("কর্মী সফলভাবে যুক্ত করা হয়েছে!");
        setIsModalOpen(false);
        setFullName("");
        setPhone("");
        setEmail("");
        setDesignation("");
        loadStaff();
      } else {
        alert(data.message || "কর্মী যুক্ত করতে সমস্যা হয়েছে");
      }
    } catch {
      alert("সার্ভার সমস্যা");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            কর্মচারী ও স্টাইলিস্ট ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            কর্মীদের প্রোফাইল, কাজের শিফট এবং কমিশন রেট কনফিগারেশন
          </p>
        </div>

        <Button size="sm" onClick={() => setIsModalOpen(true)} className="text-xs gap-1.5 font-bold">
          <Plus className="w-3.5 h-3.5" />
          <span>নতুন কর্মচারী যোগ</span>
        </Button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="font-bold">×</button>
        </div>
      )}

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffList.map((st) => (
          <Card key={st._id} className="p-5 space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-salon-primary-100 text-salon-primary flex items-center justify-center font-bold text-lg">
                  {st.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{st.fullName}</h3>
                  <span className="text-[11px] text-gray-500">{st.designation}</span>
                </div>
              </div>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                সক্রিয়
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{st.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>শিফট: {st.shiftStart} - {st.shiftEnd}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-gray-400" />
                <span>কমিশন: {toBengaliNumerals(st.commissionValue)}%</span>
              </div>
            </div>
          </Card>
        ))}

        {staffList.length === 0 && (
          <p className="col-span-3 text-center py-10 text-gray-400 text-sm">
            কোনো কর্মচারী তথ্য পাওয়া যায়নি। উপরের বাটন দিয়ে নতুন কর্মী যোগ করুন।
          </p>
        )}
      </div>

      {/* Add Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="নতুন কর্মচারী যোগ করুন"
      >
        <form onSubmit={handleAddStaff} className="space-y-4">
          <Input
            label="পূর্ণ নাম *"
            placeholder="যেমন: সাকিব আল হাসান"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            label="মোবাইল নম্বর *"
            placeholder="017XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Input
            label="ইমেইল (ঐচ্ছিক)"
            type="email"
            placeholder="staff@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="পদবী *"
              placeholder="হেয়ার স্টাইলিস্ট"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
            />
            <Input
              label="কমিশন রেট (%) *"
              type="number"
              placeholder="10"
              value={commissionValue}
              onChange={(e) => setCommissionValue(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsModalOpen(false)}
              className="w-full"
            >
              বাতিল
            </Button>
            <Button type="submit" size="md" isLoading={loading} className="w-full font-bold">
              সংরক্ষণ করুন
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
