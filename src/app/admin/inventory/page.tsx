"use client";

import React, { useState, useEffect } from "react";
import { Package, Plus, AlertTriangle, ArrowUpDown, History } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { formatBengaliCurrency, toBengaliNumerals } from "@/lib/money/poisha";

interface ProductItem {
  _id: string;
  name: string;
  sku: string;
  category: string;
  costPriceMinor: number;
  sellingPriceMinor: number;
  currentStock: number;
  reorderLevel: number;
  unit: string;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [adjustQty, setAdjustQty] = useState("10");
  const [adjustType, setAdjustType] = useState<"in" | "out" | "adjustment">("in");
  const [adjustReason, setAdjustReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Add Product Form
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("কসমেটিক্স");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [initialStock, setInitialStock] = useState("10");
  const [reorderLevel, setReorderLevel] = useState("5");
  const [unit, setUnit] = useState("পিস");

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/inventory").then((r) => r.json());
      if (res.success) setProducts(res.data);
    } catch (err) {
      console.error("Inventory load error:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          sku,
          category,
          costPrice: parseFloat(costPrice),
          sellingPrice: parseFloat(sellingPrice),
          initialStock: parseInt(initialStock, 10),
          reorderLevel: parseInt(reorderLevel, 10),
          unit,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("পণ্য সফলভাবে ইনভেন্টরিতে যুক্ত হয়েছে!");
        setIsAddModalOpen(false);
        setName("");
        setSku("");
        setCostPrice("");
        setSellingPrice("");
        loadProducts();
      } else {
        alert(data.message || "পণ্য যোগ করতে ব্যর্থ");
      }
    } catch {
      alert("সার্ভার ত্রুটি");
    } finally {
      setLoading(false);
    }
  };

  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setLoading(true);
    try {
      const res = await fetch("/api/inventory/movement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct._id,
          type: adjustType,
          quantity: parseInt(adjustQty, 10),
          reason: adjustReason || "স্টক অ্যাডজাস্টমেন্ট",
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage("স্টক সফলভাবে আপডেট হয়েছে!");
        setIsAdjustModalOpen(false);
        setSelectedProduct(null);
        setAdjustReason("");
        loadProducts();
      } else {
        alert(data.message || "স্টক আপডেট ব্যর্থ");
      }
    } catch {
      alert("সার্ভার ত্রুটি");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            ইনভেন্টরি ও পণ্য স্টক ব্যবস্থাপনা
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            সেলুনের রিটেল ও অভ্যন্তরীণ সরবরাহের স্টক ট্র্যাকিং এবং লেজার
          </p>
        </div>

        <Button size="sm" onClick={() => setIsAddModalOpen(true)} className="text-xs gap-1.5 font-bold">
          <Plus className="w-3.5 h-3.5" />
          <span>নতুন পণ্য যোগ করুন</span>
        </Button>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage("")} className="font-bold">×</button>
        </div>
      )}

      {/* Product List Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
              <tr>
                <th className="py-3 px-4">পণ্যের নাম</th>
                <th className="py-3 px-4">SKU কোড</th>
                <th className="py-3 px-4">ক্যাটেগরি</th>
                <th className="py-3 px-4">বর্তমান স্টক</th>
                <th className="py-3 px-4">ক্রয়মূল্য</th>
                <th className="py-3 px-4">বিক্রয়মূল্য</th>
                <th className="py-3 px-4">স্টক অবস্থা</th>
                <th className="py-3 px-4 text-right">কার্যক্রম</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => {
                const isLowStock = p.currentStock <= p.reorderLevel;
                return (
                  <tr key={p._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{p.name}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{p.sku}</td>
                    <td className="py-3.5 px-4 text-gray-600">{p.category}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {toBengaliNumerals(p.currentStock)} {p.unit}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {formatBengaliCurrency(p.costPriceMinor)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-salon-primary">
                      {formatBengaliCurrency(p.sellingPriceMinor)}
                    </td>
                    <td className="py-3.5 px-4">
                      {isLowStock ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          <AlertTriangle className="w-3 h-3" />
                          <span>স্বল্প স্টক</span>
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          পর্যাপ্ত
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setIsAdjustModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-salon-primary hover:text-white transition-colors text-[11px] font-semibold"
                      >
                        স্টক আপডেট
                      </button>
                    </td>
                  </tr>
                );
              })}
              {products.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400">
                    কোনো পণ্য তালিকাভুক্ত নেই।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Add Product */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="ইনভেন্টরিতে নতুন পণ্য যোগ করুন"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <Input
            label="পণ্যের নাম *"
            placeholder="যেমন: লরিয়াল হেয়ার সিরাম"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="SKU কোড *"
              placeholder="যেমন: LOR-SER-100"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              required
            />
            <Input
              label="ক্যাটেগরি"
              placeholder="কসমেটিক্স"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="ক্রয়মূল্য (টাকা) *"
              type="number"
              placeholder="350"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              required
            />
            <Input
              label="বিক্রয়মূল্য (টাকা) *"
              type="number"
              placeholder="550"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="প্রাথমিক স্টক"
              type="number"
              value={initialStock}
              onChange={(e) => setInitialStock(e.target.value)}
            />
            <Input
              label="রি-অর্ডার লেভেল"
              type="number"
              value={reorderLevel}
              onChange={(e) => setReorderLevel(e.target.value)}
            />
            <Input
              label="একক (Unit)"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsAddModalOpen(false)}
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

      {/* Modal: Adjust Stock */}
      {selectedProduct && (
        <Modal
          isOpen={isAdjustModalOpen}
          onClose={() => setIsAdjustModalOpen(false)}
          title={`স্টক আপডেট: ${selectedProduct.name}`}
        >
          <form onSubmit={handleStockAdjustment} className="space-y-4">
            <div className="p-3 rounded-xl bg-gray-50 border text-xs">
              <span className="text-gray-500">বর্তমান স্টক: </span>
              <span className="font-bold text-gray-900">
                {toBengaliNumerals(selectedProduct.currentStock)} {selectedProduct.unit}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                মুভমেন্ট টাইপ
              </label>
              <select
                value={adjustType}
                onChange={(e) => setAdjustType(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-salon-primary"
              >
                <option value="in">নতুন স্টক প্রাপ্তি (Stock In)</option>
                <option value="out">ক্ষতি বা ব্যবহার (Stock Out)</option>
                <option value="adjustment">সরাসরি কাউন্ট সমন্বয় (Adjustment)</option>
              </select>
            </div>

            <Input
              label="পরিমাণ *"
              type="number"
              min="1"
              value={adjustQty}
              onChange={(e) => setAdjustQty(e.target.value)}
              required
            />

            <Input
              label="কারণ বা রেফারেন্স নোট *"
              placeholder="যেমন: নতুন চালান ক্রয় বা অভ্যন্তরীণ সেলুন ব্যবহার"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              required
            />

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => setIsAdjustModalOpen(false)}
                className="w-full"
              >
                বাতিল
              </Button>
              <Button type="submit" size="md" isLoading={loading} className="w-full font-bold">
                স্টক আপডেট নিশ্চিত করুন
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
