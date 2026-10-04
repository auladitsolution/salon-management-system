// ==============================================================================
// POINT OF SALE (POS) & CHECKOUT API ROUTE (/api/pos)
// Salon Booking & Management System - Aulad IT Solution
//
// Financial Transactions in Exact Poisha Units
// Concurrency-Safe Sequential Invoice Numbering
// Automatic Stock Depletion & Staff Commission Calculation
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Invoice, IInvoiceItem, IInvoicePayment } from "@/models/Invoice";
import { Appointment } from "@/models/Appointment";
import { Customer } from "@/models/Customer";
import { Product } from "@/models/Product";
import { StockMovement } from "@/models/StockMovement";
import { Staff } from "@/models/Staff";
import { Commission } from "@/models/Commission";
import { BusinessSettings } from "@/models/BusinessSettings";
import { getNextSequence } from "@/models/Counter";
import { calculatePosTotals, toPoisha } from "@/lib/money/poisha";
import { normalizeBdPhone } from "@/lib/validation/phone";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      appointmentId,
      customerId,
      customerName,
      customerPhone,
      items, // Array of { type: "service" | "product", referenceId, name, quantity, unitPrice, staffId }
      discountAmount, // in BDT decimal
      taxPercent, // e.g. 5
      payments, // Array of { method, amount, transactionRef }
      notes,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "কমপক্ষে একটি সার্ভিস বা পণ্য নির্বাচন করুন।" },
        { status: 400 }
      );
    }

    if (!customerName || !customerPhone) {
      return NextResponse.json(
        { success: false, message: "গ্রাহকের নাম ও ফোন নম্বর দেওয়া আবশ্যক।" },
        { status: 400 }
      );
    }

    const phoneValidation = normalizeBdPhone(customerPhone);
    await connectToDatabase();

    // 1. Calculate Line Items in Poisha
    let calculatedSubtotal = 0;
    const processedItems: IInvoiceItem[] = [];

    for (const item of items) {
      const unitPriceMinor = toPoisha(item.unitPrice);
      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const lineTotalMinor = unitPriceMinor * qty;
      calculatedSubtotal += lineTotalMinor;

      processedItems.push({
        type: item.type === "product" ? "product" : "service",
        referenceId: item.referenceId,
        name: item.name,
        quantity: qty,
        unitPriceMinor,
        totalMinor: lineTotalMinor,
        staffId: item.staffId || undefined,
      });
    }

    // 2. Exact Poisha Financial Totals
    const discountMinor = toPoisha(discountAmount);
    const settings = await BusinessSettings.findOne();
    const effectiveTaxRate = taxPercent !== undefined ? Number(taxPercent) : (settings?.taxPercent || 0);

    // Sum paid amount from payments array
    let totalPaidMinor = 0;
    const processedPayments: IInvoicePayment[] = [];
    if (Array.isArray(payments)) {
      for (const p of payments) {
        const payMinor = toPoisha(p.amount);
        if (payMinor > 0) {
          totalPaidMinor += payMinor;
          processedPayments.push({
            method: p.method || "cash",
            amountMinor: payMinor,
            transactionRef: p.transactionRef || "",
            isManualVerified: true,
            paidAt: new Date(),
          });
        }
      }
    }

    const posResult = calculatePosTotals({
      subtotalMinor: calculatedSubtotal,
      discountMinor,
      taxPercent: effectiveTaxRate,
      paidAmountMinor: totalPaidMinor,
    });

    // 3. Concurrency-Safe Sequential Invoice Number
    const currentYear = new Date().getFullYear();
    const seq = await getNextSequence(`invoice_counter_${currentYear}`);
    const invoicePrefix = settings?.invoicePrefix || `INV-${currentYear}-`;
    const invoiceNumber = `${invoicePrefix}${seq.toString().padStart(5, "0")}`;

    // Determine payment status
    let paymentStatus: "unpaid" | "partially_paid" | "paid" = "unpaid";
    if (posResult.dueAmountMinor === 0 && posResult.paidAmountMinor > 0) {
      paymentStatus = "paid";
    } else if (posResult.paidAmountMinor > 0 && posResult.dueAmountMinor > 0) {
      paymentStatus = "partially_paid";
    }

    // 4. Create Invoice
    const invoice = await Invoice.create({
      invoiceNumber,
      appointmentId: appointmentId || undefined,
      customerId: customerId || undefined,
      customerName: customerName.trim(),
      customerPhone: phoneValidation.normalizedLocal,
      items: processedItems,
      subtotalMinor: posResult.subtotalMinor,
      discountMinor: posResult.discountMinor,
      taxMinor: posResult.taxMinor,
      totalAmountMinor: posResult.totalAmountMinor,
      paidAmountMinor: posResult.paidAmountMinor,
      dueAmountMinor: posResult.dueAmountMinor,
      paymentStatus,
      payments: processedPayments,
      notes: notes || "",
    });

    // 5. Update Inventory for Products Sold
    for (const item of processedItems) {
      if (item.type === "product") {
        const product = await Product.findById(item.referenceId);
        if (product) {
          const prevStock = product.currentStock;
          const newStock = Math.max(0, prevStock - item.quantity);
          product.currentStock = newStock;
          await product.save();

          await StockMovement.create({
            productId: product._id,
            type: "sale",
            quantity: item.quantity,
            previousStock: prevStock,
            newStock,
            reason: `POS বিক্রয়: ${invoiceNumber}`,
            referenceId: invoiceNumber,
          });
        }
      }
    }

    // 6. Record Staff Commissions for Services Performed
    for (const item of processedItems) {
      if (item.type === "service" && item.staffId) {
        const staff = await Staff.findById(item.staffId);
        if (staff && staff.commissionType !== "none") {
          let commissionMinor = 0;
          if (staff.commissionType === "percentage") {
            commissionMinor = Math.round((item.totalMinor * staff.commissionValue) / 100);
          } else if (staff.commissionType === "fixed_minor") {
            commissionMinor = Math.round(staff.commissionValue * item.quantity);
          }

          if (commissionMinor > 0) {
            await Commission.create({
              staffId: staff._id,
              appointmentId: appointmentId || undefined,
              invoiceId: invoice._id,
              serviceName: item.name,
              serviceAmountMinor: item.totalMinor,
              commissionAmountMinor: commissionMinor,
              status: "pending",
            });
          }
        }
      }
    }

    // 7. Update Customer Total Spend & Visits
    let customerDoc = customerId ? await Customer.findById(customerId) : null;
    if (!customerDoc) {
      customerDoc = await Customer.findOne({ phone: phoneValidation.normalizedLocal });
    }
    if (customerDoc) {
      customerDoc.totalSpendMinor = (customerDoc.totalSpendMinor || 0) + posResult.paidAmountMinor;
      customerDoc.totalVisits = (customerDoc.totalVisits || 0) + 1;
      customerDoc.lastVisitDate = new Date();
      await customerDoc.save();
    }

    // 8. Update Linked Appointment (if any)
    if (appointmentId) {
      const appt = await Appointment.findById(appointmentId);
      if (appt) {
        appt.bookingStatus = "completed";
        appt.paymentStatus = paymentStatus === "paid" ? "paid" : "partially_paid";
        appt.invoiceId = invoice._id;
        await appt.save();
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "ইনভয়েস ও বিক্রয় সফলভাবে সম্পন্ন হয়েছে!",
        data: invoice,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("POS Checkout error:", err);
    return NextResponse.json(
      { success: false, message: "বিক্রয় সম্পন্নে সমস্যা হয়েছে", error: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const invoiceNumber = searchParams.get("invoiceNumber");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {};
    if (invoiceNumber) query.invoiceNumber = invoiceNumber;
    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
        { customerPhone: { $regex: search, $options: "i" } },
      ];
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ success: true, data: invoices });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
