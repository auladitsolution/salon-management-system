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
  Sparkles,
  ArrowRight,
  Wallet,
} from "lucide-react";
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
        console.error("POS Catalog fetch error:", err);
      }
    }
    loadCatalog();
  }, []);

  // Add Item to Cart Helper
  const addServiceToCart = (s: CatalogService) => {
    const existingIndex = cart.findIndex((i) => i.referenceId === s._id && i.type === "service");
    if (existingIndex > -1) {
      setCart(
        cart.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
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
    if (p.currentStock <= 0) return;
    const existingIndex = cart.findIndex((i) => i.referenceId === p._id && i.type === "product");
    if (existingIndex > -1) {
      setCart(
        cart.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">পয়েন্ট অফ সেল (POS)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ক্যাশিয়ার বিলিং টার্মিনাল
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ওয়াক-ইন ও রেজিস্টার্ড কাস্টমার বিলিং, মাল্টি-পেমেন্ট এবং তাৎক্ষণিক ভ্যাট রসিদ তৈরি
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* POS Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Col: Catalog Explorer */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-xl space-y-5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="সার্ভিস বা কসমেটিক্স পণ্য অনুসন্ধান করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Services Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-rose-500" />
                  <span>সেলুন সার্ভিসসমূহ ({toBengaliNumerals(services.length)})</span>
                </h3>
                <span className="text-[11px] text-slate-500">ক্লিক করে কার্টে যোগ করুন</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
                {services
                  .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((s) => (
                    <button
                      key={s._id}
                      type="button"
                      onClick={() => addServiceToCart(s)}
                      className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/60 hover:bg-slate-900 text-left transition-all duration-200 group flex flex-col justify-between"
                    >
                      <span className="text-xs font-bold text-slate-200 line-clamp-2 group-hover:text-rose-400">
                        {s.name}
                      </span>
                      <span className="text-xs font-black text-amber-400 mt-2 block">
                        {formatBengaliCurrency(s.priceMinor)}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Retail Products Section */}
            <div className="space-y-3 pt-5 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <Package className="w-4 h-4 text-purple-500" />
                  <span>রিটেল প্রডাক্টস ও কসমেটিক্স ({toBengaliNumerals(products.length)})</span>
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
                {products
                  .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((p) => (
                    <button
                      key={p._id}
                      type="button"
                      disabled={p.currentStock <= 0}
                      onClick={() => addProductToCart(p)}
                      className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 hover:bg-slate-900 text-left transition-all duration-200 group flex flex-col justify-between disabled:opacity-30"
                    >
                      <div>
                        <span className="text-xs font-bold text-slate-200 line-clamp-1 group-hover:text-purple-400">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-semibold">
                          স্টক: {toBengaliNumerals(p.currentStock)} {p.unit}
                        </span>
                      </div>
                      <span className="text-xs font-black text-emerald-400 mt-2 block">
                        {formatBengaliCurrency(p.sellingPriceMinor)}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Bill Cart & Payment Processing */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800/90 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                <span>বিলিং কার্ট ({toBengaliNumerals(cart.length)})</span>
              </h3>
              {cart.length > 0 && (
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-rose-400 hover:text-rose-300 font-bold"
                >
                  সব মুছুন
                </button>
              )}
            </div>

            {/* Cart Items List */}
            <div className="space-y-2 py-1 max-h-56 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-200 block">{item.name}</span>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>৳{item.unitPrice} × {item.quantity}</span>
                      {item.type === "service" && staffList.length > 0 && (
                        <select
                          value={item.staffId}
                          onChange={(e) => {
                            const newCart = [...cart];
                            newCart[idx].staffId = e.target.value;
                            setCart(newCart);
                          }}
                          className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2 py-0.5 text-[10px] focus:outline-none"
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
                    <span className="font-black text-amber-400 text-sm">
                      {formatBengaliCurrency(toPoisha(item.unitPrice * item.quantity))}
                    </span>
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {cart.length === 0 && (
                <p className="text-center py-8 text-xs text-slate-500 font-semibold">
                  কার্ট বর্তমানে খালি। বামের তালিকা থেকে আইটেম সিলেক্ট করুন।
                </p>
              )}
            </div>

            {/* Customer Inputs */}
            <div className="grid grid-cols-2 gap-3 py-3 border-t border-slate-800">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">গ্রাহকের নাম</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Discount and Tax */}
            <div className="grid grid-cols-2 gap-3 pb-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  ছাড় / ডিসকাউন্ট (টাকা)
                </label>
                <input
                  type="number"
                  min="0"
                  value={discountBdt}
                  onChange={(e) => setDiscountBdt(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  ভ্যাট / ট্যাক্স (%)
                </label>
                <input
                  type="number"
                  min="0"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5 pb-2">
              <label className="block text-[11px] font-bold text-slate-400">
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
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      paymentMethod === m.id
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                        : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod !== "cash" && (
              <div className="pb-2">
                <label className="block text-[11px] font-bold text-slate-400 mb-1">TRX ID / রেফারেন্স</label>
                <input
                  type="text"
                  placeholder="যেমন: 9J3K8L2P"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            )}

            {/* Poisha Totals Summary */}
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>উপমোট:</span>
                <span className="font-semibold text-slate-200">{formatBengaliCurrency(totals.subtotalMinor)}</span>
              </div>
              {totals.discountMinor > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>ছাড়:</span>
                  <span>- {formatBengaliCurrency(totals.discountMinor)}</span>
                </div>
              )}
              {totals.taxMinor > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>ভ্যাট ({taxPercent}%):</span>
                  <span>+ {formatBengaliCurrency(totals.taxMinor)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-sm pt-2 border-t border-slate-800">
                <span className="text-white">সর্বমোট বিল:</span>
                <span className="text-amber-400 text-lg">
                  {formatBengaliCurrency(totals.totalAmountMinor)}
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="gold"
              size="lg"
              disabled={cart.length === 0}
              isLoading={loading}
              onClick={handleCheckout}
              className="w-full mt-4 font-black text-slate-950 shadow-glow-gold"
            >
              <CreditCard className="w-5 h-5 mr-1" />
              <span>চেকআউট ও রসিদ তৈরি</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {successInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-md w-full p-7 space-y-5 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto text-slate-900">
            {/* Printable Content */}
            <div id="printable-receipt" className="space-y-4 text-center font-mono text-xs">
              <div className="space-y-1 border-b pb-3">
                <h3 className="font-black text-lg font-sans text-slate-900">গ্ল্যামার লাউঞ্জ ও সেলুন</h3>
                <p className="text-[11px] text-gray-500 font-sans">রোড ৪/এ, ধানমন্ডি, ঢাকা</p>
                <p className="text-[11px] text-gray-500 font-sans">ফোন: 01700000000</p>
                <p className="font-bold text-xs pt-1 text-rose-600 font-mono">
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
                আমাদের সেবা গ্রহণের জন্য আন্তরিক ধন্যবাদ!
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2 border-t">
              <Button
                variant="outline"
                size="md"
                onClick={() => window.print()}
                className="w-full gap-2 text-xs font-bold"
              >
                <Printer className="w-4 h-4" />
                <span>প্রিন্ট রসিদ</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setSuccessInvoice(null)}
                className="w-full text-xs font-bold"
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
