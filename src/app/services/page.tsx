import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Scissors, Clock } from "lucide-react";
import { connectToDatabase } from "@/lib/db/connect";
import { Service } from "@/models/Service";
import { ServiceCategory } from "@/models/ServiceCategory";
import { formatBengaliCurrency, toBengaliNumerals } from "@/lib/money/poisha";

export const dynamic = "force-dynamic";

async function getServicesData() {
  try {
    await connectToDatabase();
    const categories = await ServiceCategory.find({ isActive: true }).sort({ orderIndex: 1 }).lean();
    const services = await Service.find({ isActive: true }).populate("categoryId", "name slug").lean();
    return { categories, services };
  } catch (err) {
    console.error("Services page fetch error:", err);
    return { categories: [], services: [] };
  }
}

export default async function ServicesPage() {
  const { categories, services } = await getServicesData();

  return (
    <div className="min-h-screen flex flex-col bg-salon-cream">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h1 className="text-4xl font-extrabold text-salon-dark tracking-tight">
            আমাদের সকল সার্ভিস ও প্রাইসিং
          </h1>
          <p className="text-sm text-salon-muted">
            অভিজ্ঞ বিউটিশিয়ান ও স্টাইলিস্টদের দ্বারা প্রদত্ত সকল প্রিমিয়াম সেবা
          </p>
        </div>

        {categories.map((cat) => {
          const categoryServices = services.filter(
            (s) => (s.categoryId as unknown as { _id?: string })?._id?.toString() === cat._id.toString()
          );

          if (categoryServices.length === 0) return null;

          return (
            <div key={cat._id.toString()} className="mb-14">
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-salon-primary/10">
                <Scissors className="w-5 h-5 text-salon-primary" />
                <h2 className="text-2xl font-bold text-salon-dark">{cat.name}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryServices.map((service) => (
                  <Card key={service._id.toString()} className="flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-salon-primary-100 text-salon-primary">
                          {toBengaliNumerals(service.durationMinutes)} মিনিট
                        </span>
                        <span className="text-lg font-bold text-salon-primary">
                          {formatBengaliCurrency(service.priceMinor)}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-salon-dark">{service.name}</h3>
                      <p className="text-xs text-salon-muted leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-salon-primary/10 mt-6 flex items-center justify-between">
                      <span className="text-xs text-salon-muted flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {toBengaliNumerals(service.durationMinutes)} মি.
                      </span>
                      <Link href={`/book?serviceId=${service._id.toString()}`}>
                        <Button size="sm">বুকিং করুন</Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}

        {services.length === 0 && (
          <p className="text-center py-12 text-salon-muted">
            বর্তমানে কোনো সার্ভিস তালিকাভুক্ত নেই। অ্যাডমিন প্যানেল থেকে সার্ভিস যুক্ত করুন।
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}
