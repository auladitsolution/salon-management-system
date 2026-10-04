"use client";

import React, { useState, useEffect } from "react";
import {
  Scissors,
  Package,
  Plus,
  Trash2,
  Printer,
  CreditCard,
  DollarSign,
  User,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatBengaliCurrency, toBengaliNumerals, toPoisha, calculatePosTotals, toBdtDecimal } from "@/lib/money/poisha";
import { formatBengaliDate, formatBengaliTime } from "@/lib/dates/bengaliDate";

interface CatalogService {
  _id: string;
  name: string;
  priceMinor: number;
}

interface CatalogProduct {
  _id: string;
  name: string;
  sku: string;
  sellingPriceMinor: number;
  currentStock: number;
  unit: string;
}

interface StaffMember {
  _id: string;
  fullName: string;
}

interface CartItem {
  type: "service" | "product";
  referenceId: string;
  name: string;
  quantity: number;
  unitPrice: number; // in BDT decimal
  staffId?: string;
}

interface GeneratedInvoice {
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  subtotalMinor: number;
  discountMinor: number;
  taxMinor: number;
  totalAmountMinor: number;
  paidAmountMinor: number;
  dueAmountMinor: number;
  paymentStatus: string;
  items: Array<{ name: string; quantity: number; unitPriceMinor: number; totalMinor: number }>;
  payments: Array<{ method: string; amountMinor: number; transactionRef?: string }>;
  createdAt: string;
}

export default function PosPage() {
  const [services, setServices] = useState<CatalogService[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);

  // Cart & Transaction State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("সাধারণ গ্রাহক (Walk-in)");
  const [customerPhone, setCustomerPhone] = useState("01700000000");
  const [discountBdt, setDiscountBdt] = useState<number>(0);
  const [taxPercent, setTaxPercent] = useState<number>(5);

  // Payment Breakdown
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [paymentAmountBdt, setPaymentAmountBdt] = useState<string>("");
  const [trxId, setTrxId] = useState("");

  const [loading, setLoading] = useState(false);
  const [successInvoice, setSuccessInvoice] = useState<GeneratedInvoice | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Search filter for catalog items
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [servRes, prodRes, staffRes] = await Promise.all([
          fetch("/api/services").then((r) => r.json()),
          fetch("/api/inventory").then((r) => r.json()),
          fetch("/api/staff").then((r) => r.json()),
        ]);
        if (servRes.success) setServices(servRes.data);
        if (prodRes.success) setProducts(prodRes.data);
        if (staffRes.success) setStaffList(staffRes.data);
      } catch (err) {
        console.error("POS load error:", err);
      }
    }
    loadCatalog();
  }, []);

  // Add Item to Cart
  const addServiceToCart = (s: CatalogService) => {
    const existing = cart.find((i) => i.type === "service" && i.referenceId === s._id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.type === "service" && i.referenceId === s._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          type: "service",
          referenceId: s._id,
          name: s.name,
          quantity: 1,
          unitPrice: s.priceMinor / 100,
          staffId: staffList[0]?._id,
        },
      ]);
    }
  };

  const addProductToCart = (p: CatalogProduct) => {
    if (p.currentStock <= 0) {
      setErrorMessage(`${p.name} পণ্যটির স্টক শেষ!`);
      return;
    }
    const existing = cart.find((i) => i.type === "product" && i.referenceId === p._id);
    if (existing) {
      setCart(
        cart.map((i) =>
          i.type === "product" && i.referenceId === p._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCart([
        ...cart,
        {
          type: "product",
          referenceId: p._id,
          name: p.name,
          quantity: 1,
          unitPrice: p.sellingPriceMinor / 100,
        },
      ]);
    }
  };

  const removeItem = (index: number) => {
    setCart(cart.filter((_, idx) => idx !== index));
  };

  // Calculations
  const calculatedSubtotalMinor = cart.reduce(
    (sum, item) => sum + toPoisha(item.unitPrice) * item.quantity,
    0
  );
  const discountMinor = toPoisha(discountBdt);
  const paidMinor = toPoisha(paymentAmountBdt || (calculatedSubtotalMinor / 100));

  const totals = calculatePosTotals({
    subtotalMinor: calculatedSubtotalMinor,
    discountMinor,
    taxPercent,
    paidAmountMinor: paidMinor,
  });

  // Handle Checkout Submission
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMessage("কার্টে কোনো আইটেম নেই।");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        items: cart.map((i) => ({
          type: i.type,
          referenceId: i.referenceId,
          name: i.name,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          staffId: i.staffId,
        })),
        discountAmount: discountBdt,
        taxPercent,
        payments: [
          {
            method: paymentMethod,
            amount: paymentAmountBdt ? parseFloat(paymentAmountBdt) : totals.totalAmountMinor / 100,
            transactionRef: trxId,
          },
        ],
      };

      const res = await fetch("/api/pos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.message || "বিক্রয় সম্পন্ন হতে ব্যর্থ হয়েছে।");
        return;
      }

      setSuccessInvoice(data.data);
      setCart([]);
      setPaymentAmountBdt("");
      setTrxId("");
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "সার্ভার এরর");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            পয়েন্ট অফ সেল (POS ক্যাশিয়ার)
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ওয়াক-ইন ও কাস্টমার বিলিং, স্প্লিট পেমেন্ট এবং তাৎক্ষণিক রসিদ
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* POS Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Catalog Explorer (Services & Retail Products) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="p-5">
            <div className="relative mb-4">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="সার্ভিস বা পণ্য অনুসন্ধান করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-salon-primary"
              />
            </div>

            {/* Services Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-salon-primary" />
                <span>সেলুন সার্ভিসসমূহ</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {services
                  .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((s) => (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => addServiceToCart(s)}
                      className="p-2.5 rounded-xl border border-gray-200 hover:border-salon-primary hover:bg-salon-primary-50/50 text-left transition-all group flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-salon-primary">
                        {s.name}
                      </span>
                      <span className="text-[11px] font-semibold text-salon-primary mt-2">
                        {formatBengaliCurrency(s.priceMinor)}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Retail Products Section */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-salon-primary" />
                <span>রিটেল কসমেটিক্স ও পণ্য</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
                {products
                  .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((p) => (
                    <button
                      key={p._id}
                      type="button"
                      disabled={p.currentStock <= 0}
                      onClick={() => addProductToCart(p)}
                      className="p-2.5 rounded-xl border border-gray-200 hover:border-salon-primary hover:bg-salon-primary-50/50 text-left transition-all group flex flex-col justify-between disabled:opacity-40"
                    >
                      <div>
                        <span className="text-xs font-bold text-gray-800 line-clamp-1 group-hover:text-salon-primary">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          স্টক: {toBengaliNumerals(p.currentStock)} {p.unit}
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-salon-primary mt-2">
                        {formatBengaliCurrency(p.sellingPriceMinor)}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Bill Cart & Payment Processing */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="p-5">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100 flex items-center justify-between">
              <span>বিলিং কার্ট ({toBengaliNumerals(cart.length)})</span>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-rose-600 hover:underline"
                >
                  সব মুছুন
                </button>
              )}
            </h3>

            {/* Cart Items List */}
            <div className="space-y-2 py-3 max-h-52 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-gray-800">{item.name}</span>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span>৳{item.unitPrice} × {item.quantity}</span>
                      {item.type === "service" && staffList.length > 0 && (
                        <select
                          value={item.staffId}
                          onChange={(e) => {
                            const newCart = [...cart];
                            newCart[idx].staffId = e.target.value;
                            setCart(newCart);
                          }}
                          className="bg-white border rounded px-1 text-[10px]"
                        >
                          {staffList.map((st) => (
                            <option key={st._id} value={st._id}>
                              {st.fullName}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">
                      {formatBengaliCurrency(toPoisha(item.unitPrice * item.quantity))}
                    </span>
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-gray-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <p className="text-center py-6 text-xs text-gray-400">
                  কার্টে কোনো আইটেম নেই। বামের তালিকা থেকে যোগ করুন।
                </p>
              )}
            </div>

            {/* Customer Details Inputs */}
            <div className="grid grid-cols-2 gap-3 py-3 border-t border-gray-100">
              <Input
                label="গ্রাহকের নাম"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="text-xs py-1.5"
              />
              <Input
                label="মোবাইল নম্বর"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="text-xs py-1.5"
              />
            </div>

            {/* Discount and Tax */}
            <div className="grid grid-cols-2 gap-3 pb-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  ছাড় / ডিসকাউন্ট (টাকা)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discountBdt}
                  onChange={(e) => setDiscountBdt(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:ring-1 focus:ring-salon-primary"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-600 mb-1">
                  ভ্যাট / ট্যাক্স (%)
                </label>
                <input
                  type="number"
                  min="0"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:ring-1 focus:ring-salon-primary"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5 pb-3">
              <label className="block text-[11px] font-medium text-gray-600">
                পেমেন্ট মাধ্যম
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "cash", label: "নগদ (Cash)" },
                  { id: "bkash", label: "বিকাশ (bKash)" },
                  { id: "nagad", label: "নগদ (Nagad)" },
                  { id: "rocket", label: "রকেট (Rocket)" },
                  { id: "card", label: "কার্ড (Card)" },
                  { id: "bank", label: "ব্যাংক" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                      paymentMethod === m.id
                        ? "bg-salon-primary text-white border-salon-primary"
                        : "bg-white text-gray-700 border-gray-200 hover:border-salon-primary"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod !== "cash" && (
              <div className="pb-3">
                <Input
                  label="ট্রানজেকশন রেফারেন্স / TRX ID (ঐচ্ছিক)"
                  placeholder="যেমন: 9J3K8L2P"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="text-xs py-1.5"
                />
              </div>
            )}

            {/* Poisha Totals Summary */}
            <div className="space-y-1.5 pt-3 border-t border-gray-100 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>উপমোট:</span>
                <span>{formatBengaliCurrency(totals.subtotalMinor)}</span>
              </div>
              {totals.discountMinor > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>ছাড়:</span>
                  <span>- {formatBengaliCurrency(totals.discountMinor)}</span>
                </div>
              )}
              {totals.taxMinor > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>ভ্যাট ({taxPercent}%):</span>
                  <span>+ {formatBengaliCurrency(totals.taxMinor)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-gray-900 pt-1 border-t border-gray-100">
                <span>সর্বমোট বিল:</span>
                <span className="text-salon-primary text-base">
                  {formatBengaliCurrency(totals.totalAmountMinor)}
                </span>
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              disabled={cart.length === 0}
              isLoading={loading}
              onClick={handleCheckout}
              className="w-full mt-4 font-bold"
            >
              চেকআউট ও রসিদ তৈরি (৳)
            </Button>
          </Card>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {successInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            {/* Printable Content */}
            <div id="printable-receipt" className="space-y-4 text-center font-mono text-xs">
              <div className="space-y-1 border-b pb-3">
                <h3 className="font-bold text-base font-sans">গ্ল্যামার লাউঞ্জ ও সেলুন</h3>
                <p className="text-[11px] text-gray-500 font-sans">রোড ৪/এ, ধানমন্ডি, ঢাকা</p>
                <p className="text-[11px] text-gray-500 font-sans">ফোন: 01700000000</p>
                <p className="font-bold text-xs pt-1 text-salon-primary font-mono">
                  ইনভয়েস: {successInvoice.invoiceNumber}
                </p>
              </div>

              <div className="text-left space-y-1 text-[11px]">
                <p>গ্রাহক: {successInvoice.customerName}</p>
                <p>ফোন: {successInvoice.customerPhone}</p>
                <p>তারিখ: {new Date(successInvoice.createdAt).toLocaleString("bn-BD")}</p>
              </div>

              <table className="w-full text-left border-t border-b py-2 text-[11px]">
                <thead>
                  <tr className="border-b">
                    <th className="py-1">আইটেম</th>
                    <th className="py-1 text-center">পরিমাণ</th>
                    <th className="py-1 text-right">মূল্য</th>
                  </tr>
                </thead>
                <tbody>
                  {successInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-1 font-sans">{it.name}</td>
                      <td className="py-1 text-center">{toBengaliNumerals(it.quantity)}</td>
                      <td className="py-1 text-right">{formatBengaliCurrency(it.totalMinor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-1 text-right text-[11px]">
                <p>উপমোট: {formatBengaliCurrency(successInvoice.subtotalMinor)}</p>
                {successInvoice.discountMinor > 0 && (
                  <p className="text-emerald-700">ছাড়: - {formatBengaliCurrency(successInvoice.discountMinor)}</p>
                )}
                {successInvoice.taxMinor > 0 && (
                  <p>ভ্যাট: + {formatBengaliCurrency(successInvoice.taxMinor)}</p>
                )}
                <p className="font-bold text-xs pt-1 border-t">
                  সর্বমোট: {formatBengaliCurrency(successInvoice.totalAmountMinor)}
                </p>
                <p className="font-bold text-emerald-700">
                  পরিশোধিত: {formatBengaliCurrency(successInvoice.paidAmountMinor)}
                </p>
                {successInvoice.dueAmountMinor > 0 && (
                  <p className="font-bold text-rose-600">
                    বকেয়া: {formatBengaliCurrency(successInvoice.dueAmountMinor)}
                  </p>
                )}
              </div>

              <p className="pt-3 text-[10px] text-gray-500 font-sans">
                আমাদের সেবা গ্রহণের জন্য ধন্যবাদ! আবার আসবেন।
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="outline"
                size="md"
                onClick={() => window.print()}
                className="w-full gap-2 text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট রসিদ</span>
              </Button>
              <Button
                size="md"
                onClick={() => setSuccessInvoice(null)}
                className="w-full text-xs"
              >
                পরবর্তী বিক্রয়
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
