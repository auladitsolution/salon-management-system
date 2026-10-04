// ==============================================================================
// SECURE CSV EXPORT API ROUTE (/api/export/csv)
// Salon Booking & Management System - Aulad IT Solution
//
// Formula Injection Sanitization Enabled
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Customer } from "@/models/Customer";
import { Appointment } from "@/models/Appointment";
import { Invoice } from "@/models/Invoice";
import { Expense } from "@/models/Expense";
import { Product } from "@/models/Product";
import { toBdtDecimal } from "@/lib/money/poisha";

function sanitizeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return "";
  let str = String(val).replace(/"/g, '""');
  // Formula Injection prevention: prepend single quote if formula trigger character
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str}"`;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "customers" | "appointments" | "sales" | "expenses" | "inventory"

    await connectToDatabase();
    let csvRows: string[] = [];
    let filename = `export-${type}-${Date.now()}.csv`;

    if (type === "customers") {
      const customers = await Customer.find().sort({ createdAt: -1 });
      csvRows.push(["গ্রাহকের নাম", "মোবাইল নম্বর", "ইমেইল", "মোট খরচ (টাকা)", "মোট ভিজিট"].map(sanitizeCsvCell).join(","));
      for (const c of customers) {
        csvRows.push([
          c.name,
          c.phone,
          c.email || "",
          toBdtDecimal(c.totalSpendMinor),
          c.totalVisits,
        ].map(sanitizeCsvCell).join(","));
      }
    } else if (type === "appointments") {
      const appts = await Appointment.find().populate("staffId", "fullName").sort({ appointmentDate: -1 });
      csvRows.push(["বুকিং রেফারেন্স", "গ্রাহকের নাম", "মোবাইল", "তারিখ", "সময়", "কর্মী", "মোট মূল্য (টাকা)", "অবস্থা", "পেমেন্ট"].map(sanitizeCsvCell).join(","));
      for (const a of appts) {
        const staffName = (a.staffId as unknown as { fullName?: string })?.fullName || "";
        csvRows.push([
          a.bookingReference,
          a.customerName,
          a.customerPhone,
          a.appointmentDate,
          a.startTime,
          staffName,
          toBdtDecimal(a.totalMinor),
          a.bookingStatus,
          a.paymentStatus,
        ].map(sanitizeCsvCell).join(","));
      }
    } else if (type === "sales") {
      const invoices = await Invoice.find().sort({ createdAt: -1 });
      csvRows.push(["ইনভয়েস নম্বর", "গ্রাহক", "মোবাইল", "মোট মূল্য (টাকা)", "পরিশোধিত (টাকা)", "বকেয়া (টাকা)", "পেমেন্ট অবস্থা"].map(sanitizeCsvCell).join(","));
      for (const inv of invoices) {
        csvRows.push([
          inv.invoiceNumber,
          inv.customerName,
          inv.customerPhone,
          toBdtDecimal(inv.totalAmountMinor),
          toBdtDecimal(inv.paidAmountMinor),
          toBdtDecimal(inv.dueAmountMinor),
          inv.paymentStatus,
        ].map(sanitizeCsvCell).join(","));
      }
    } else if (type === "inventory") {
      const products = await Product.find().sort({ name: 1 });
      csvRows.push(["পণ্যের নাম", "SKU", "ক্যাটেগরি", "বর্তমান স্টক", "একক", "ক্রয়মূল্য (টাকা)", "বিক্রয়মূল্য (টাকা)"].map(sanitizeCsvCell).join(","));
      for (const p of products) {
        csvRows.push([
          p.name,
          p.sku,
          p.category,
          p.currentStock,
          p.unit,
          toBdtDecimal(p.costPriceMinor),
          toBdtDecimal(p.sellingPriceMinor),
        ].map(sanitizeCsvCell).join(","));
      }
    } else if (type === "expenses") {
      const expenses = await Expense.find().sort({ expenseDate: -1 });
      csvRows.push(["তারিখ", "শিরোনাম", "ক্যাটেগরি", "পরিমাণ (টাকা)", "পেমেন্ট মাধ্যম"].map(sanitizeCsvCell).join(","));
      for (const exp of expenses) {
        csvRows.push([
          new Date(exp.expenseDate).toLocaleDateString("en-CA"),
          exp.title,
          exp.category,
          toBdtDecimal(exp.amountMinor),
          exp.paymentMethod,
        ].map(sanitizeCsvCell).join(","));
      }
    } else {
      return NextResponse.json({ success: false, message: "অবৈধ এক্সপোর্ট টাইপ" }, { status: 400 });
    }

    const csvContent = "\uFEFF" + csvRows.join("\r\n"); // Add UTF-8 BOM for Excel Bengali rendering
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
