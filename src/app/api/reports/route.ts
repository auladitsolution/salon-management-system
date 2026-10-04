// ==============================================================================
// BUSINESS ANALYTICS & REPORTS API ROUTE (/api/reports)
// Salon Booking & Management System - Aulad IT Solution
//
// Calculates Real Database-Backed KPIs & Financial Aggregations
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Appointment } from "@/models/Appointment";
import { Invoice } from "@/models/Invoice";
import { Customer } from "@/models/Customer";
import { Staff } from "@/models/Staff";
import { Product } from "@/models/Product";
import { Expense } from "@/models/Expense";
import { getDhakaTodayString } from "@/lib/dates/bengaliDate";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const todayStr = getDhakaTodayString();

    const startOfToday = new Date(`${todayStr}T00:00:00.000Z`);
    const endOfToday = new Date(`${todayStr}T23:59:59.999Z`);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Appointment KPIs
    const [todayApptsCount, pendingApptsCount, completedApptsCount] = await Promise.all([
      Appointment.countDocuments({ appointmentDate: todayStr }),
      Appointment.countDocuments({ bookingStatus: "pending" }),
      Appointment.countDocuments({ bookingStatus: "completed" }),
    ]);

    // 2. Financial KPIs from Invoices
    const todayInvoices = await Invoice.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });
    const todaySalesMinor = todayInvoices.reduce((sum, inv) => sum + (inv.paidAmountMinor || 0), 0);

    const monthInvoices = await Invoice.find({
      createdAt: { $gte: startOfMonth },
    });
    const monthlySalesMinor = monthInvoices.reduce((sum, inv) => sum + (inv.paidAmountMinor || 0), 0);

    const dueInvoices = await Invoice.find({
      paymentStatus: { $in: ["unpaid", "partially_paid"] },
    });
    const duePaymentsMinor = dueInvoices.reduce((sum, inv) => sum + (inv.dueAmountMinor || 0), 0);

    // 3. Customer & Staff Counts
    const [totalCustomers, totalStaff] = await Promise.all([
      Customer.countDocuments(),
      Staff.countDocuments({ isActive: true }),
    ]);

    // 4. Low-stock inventory alert count
    const allProducts = await Product.find({ isActive: true });
    const lowStockCount = allProducts.filter((p) => p.currentStock <= p.reorderLevel).length;

    // 5. Total Expenses this month
    const monthExpenses = await Expense.find({
      expenseDate: { $gte: startOfMonth },
    });
    const monthlyExpenseMinor = monthExpenses.reduce((sum, exp) => sum + (exp.amountMinor || 0), 0);

    // 6. Recent Appointments (Today & Upcoming)
    const recentAppointments = await Appointment.find()
      .populate("staffId", "fullName designation avatarUrl")
      .sort({ createdAt: -1 })
      .limit(6);

    // 7. Recent Invoices
    const recentInvoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .limit(6);

    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          todayAppointments: todayApptsCount,
          pendingBookings: pendingApptsCount,
          completedServices: completedApptsCount,
          todaySalesMinor,
          monthlySalesMinor,
          duePaymentsMinor,
          totalCustomers,
          totalStaff,
          lowStockCount,
          monthlyExpenseMinor,
          netOperatingCashMinor: monthlySalesMinor - monthlyExpenseMinor,
        },
        recentAppointments,
        recentInvoices,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Reports API error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
