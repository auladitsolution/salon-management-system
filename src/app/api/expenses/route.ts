// ==============================================================================
// EXPENSES API ROUTE (/api/expenses)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/connect";
import { Expense } from "@/models/Expense";
import { toPoisha } from "@/lib/money/poisha";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const query: Record<string, unknown> = {};
    if (category) query.category = category;

    const expenses = await Expense.find(query).sort({ expenseDate: -1 }).limit(100);
    return NextResponse.json({ success: true, data: expenses });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, category, amount, expenseDate, paymentMethod, description } = body;

    if (!title || !category || amount === undefined) {
      return NextResponse.json(
        { success: false, message: "খরচের শিরোনাম, ক্যাটেগরি এবং পরিমাণ আবশ্যক।" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const expense = await Expense.create({
      title: title.trim(),
      category,
      amountMinor: toPoisha(amount),
      expenseDate: expenseDate ? new Date(expenseDate) : new Date(),
      paymentMethod: paymentMethod || "cash",
      description: description || "",
    });

    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
