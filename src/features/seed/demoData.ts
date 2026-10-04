// ==============================================================================
// DEMO DATA SEEDING ENGINE (ডেমো সার্ভিস ও ডাটা সিডার)
// Salon Booking & Management System - Aulad IT Solution
// ==============================================================================

import { connectToDatabase } from "@/lib/db/connect";
import { ServiceCategory } from "@/models/ServiceCategory";
import { Service } from "@/models/Service";
import { Staff } from "@/models/Staff";
import { Product } from "@/models/Product";
import { BusinessSettings } from "@/models/BusinessSettings";

export async function seedDemoServices() {
  await connectToDatabase();

  // 1. Ensure Default Business Settings
  let settings = await BusinessSettings.findOne();
  if (!settings) {
    settings = await BusinessSettings.create({
      salonName: "গ্ল্যামার লাউঞ্জ ও প্রিমিয়াম সেলুন",
      tagline: "আপনার সৌন্দর্য, আমাদের যত্ন",
      phone: "01700000000",
      email: "contact@auladit.com",
      address: "রোড ৪/এ, ধানমন্ডি, ঢাকা - ১২০৯",
      openingTime: "09:00",
      closingTime: "21:00",
      slotIntervalMinutes: 30,
      currency: "BDT",
      currencySymbol: "৳",
      taxPercent: 5,
      invoicePrefix: "INV-2026-",
    });
  } else {
    settings.openingTime = "09:00";
    settings.closingTime = "21:00";
    await settings.save();
  }

  // 2. Demo Staff
  const demoStaffMembers = [
    {
      fullName: "রাকিব হাসান",
      phone: "01711000001",
      email: "rakib@auladit.com",
      designation: "সিনিয়র হেয়ার স্টাইলিস্ট",
      specialization: ["হেয়ার কাট", "হেয়ার স্পা", "কালারিং"],
      workingDays: [0, 1, 2, 3, 4, 6],
      shiftStart: "09:00",
      shiftEnd: "20:00",
      commissionType: "percentage" as const,
      commissionValue: 12,
      isActive: true,
    },
    {
      fullName: "আফরিন সুলতানা",
      phone: "01711000002",
      email: "afrin@auladit.com",
      designation: "বিউটি ও স্কিন কেয়ার এক্সপার্ট",
      specialization: ["ফেসিয়াল", "ব্রাইডাল মেকআপ", "স্কিন কেয়ার"],
      workingDays: [0, 1, 2, 3, 4, 5],
      shiftStart: "10:00",
      shiftEnd: "19:00",
      commissionType: "percentage" as const,
      commissionValue: 15,
      isActive: true,
    },
    {
      fullName: "মাহমুদ আলী",
      phone: "01711000003",
      email: "mahmud@auladit.com",
      designation: "গ্রুমিং ও বিয়ার্ড স্পেশালিস্ট",
      specialization: ["দাড়ি শেপিং", "হট টাওয়েল শেভ", "ফেস স্পা"],
      workingDays: [0, 1, 2, 3, 4, 6],
      shiftStart: "09:30",
      shiftEnd: "20:30",
      commissionType: "percentage" as const,
      commissionValue: 10,
      isActive: true,
    },
    {
      fullName: "শায়লা খানম",
      phone: "01711000004",
      email: "shayla@auladit.com",
      designation: "মেকআপ ও স্পা থেরাপিস্ট",
      specialization: ["পার্টি মেকআপ", "ম্যানিকিউর", "পেডিকিউর", "বডি স্পা"],
      workingDays: [0, 1, 2, 4, 5, 6],
      shiftStart: "10:00",
      shiftEnd: "20:00",
      commissionType: "percentage" as const,
      commissionValue: 12,
      isActive: true,
    },
  ];

  const createdStaff = [];
  for (const st of demoStaffMembers) {
    const existing = await Staff.findOne({ phone: st.phone });
    if (!existing) {
      const created = await Staff.create(st);
      createdStaff.push(created);
    } else {
      createdStaff.push(existing);
    }
  }

  const staffIds = createdStaff.map((s) => s._id);

  // 3. Demo Categories
  const demoCategories = [
    {
      name: "হেয়ার কাট ও স্টাইলিং",
      slug: "hair-cut-styling",
      description: "আধুনিক ট্রেন্ডি হেয়ারকাট, হেয়ার ওয়াশ ও প্রফেশনাল সেটিং",
      orderIndex: 1,
    },
    {
      name: "দাড়ি ও স্পেশাল গ্রুমিং",
      slug: "beard-grooming",
      description: "নিখুঁত বিয়ার্ড শেপিং, হট টাওয়েল শেভ ও বিয়ার্ড নারিশিং",
      orderIndex: 2,
    },
    {
      name: "ফেসিয়াল ও স্কিন কেয়ার",
      slug: "facial-skin-care",
      description: "ত্বকের উজ্জ্বলতা বৃদ্ধিতে গোল্ড ও হার্বাল ফেসিয়াল থেরাপি",
      orderIndex: 3,
    },
    {
      name: "হেয়ার কালার ও স্পা",
      slug: "hair-color-spa",
      description: "প্রিমিয়াম অ্যামোনিয়া-মুক্ত হেয়ার ডাই ও ডিপ স্পা কন্ডিশনিং",
      orderIndex: 4,
    },
    {
      name: "ব্রাইডাল ও পার্টি মেকআপ",
      slug: "bridal-makeup",
      description: "ওয়েডিং, এনগেজমেন্ট ও পার্টি এক্সক্লুসিভ মেকওভার",
      orderIndex: 5,
    },
    {
      name: "স্পা ও রিল্যাক্সেশন",
      slug: "spa-massage",
      description: "ক্লান্তি দূর করতে হেড, শোল্ডার ও ফুল বডি আয়ুর্বেদিক স্পা",
      orderIndex: 6,
    },
    {
      name: "ম্যানিকিউর ও পেডিকিউর",
      slug: "manicure-pedicure",
      description: "হাত ও পায়ের যত্ন, স্ক্রাবিং, নেইল শেপিং ও স্পা কেয়ার",
      orderIndex: 7,
    },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of demoCategories) {
    const record = await ServiceCategory.findOneAndUpdate(
      { slug: cat.slug },
      { ...cat, isActive: true },
      { upsert: true, new: true }
    );
    categoryMap[cat.slug] = record._id.toString();
  }

  // 4. Demo Services Catalog
  const demoServicesList = [
    // হেয়ার কাট ও স্টাইলিং
    {
      name: "সিগনেচার হেয়ার কাট ও ওয়াশ",
      slug: "signature-haircut-wash",
      categorySlug: "hair-cut-styling",
      description: "কনসালটেশন, হেয়ার স্পা শ্যাম্পু ওয়াশ, ট্রেন্ডি কাটিং ও ড্রায়ার সেটিং।",
      priceMinor: 35000, // ৳ 350
      durationMinutes: 35,
      bufferAfterMinutes: 5,
      isFeatured: true,
    },
    {
      name: "ফেড হেয়ারকাট ও স্টাইলিং",
      slug: "fade-haircut-styling",
      categorySlug: "hair-cut-styling",
      description: "স্কিন ফেড বা টেপার ফেড কাট সাথে ম্যাট ক্লে হেয়ার স্টাইলিং।",
      priceMinor: 40000, // ৳ 400
      durationMinutes: 30,
      bufferAfterMinutes: 5,
      isFeatured: true,
    },
    {
      name: "বেবি হেয়ার কাট",
      slug: "baby-haircut",
      categorySlug: "hair-cut-styling",
      description: "শিশুদের জন্য ধৈর্যশীল ও নিরাপদ আরামদায়ক হেয়ারকাট।",
      priceMinor: 25000, // ৳ 250
      durationMinutes: 25,
      bufferAfterMinutes: 5,
      isFeatured: false,
    },

    // দাড়ি ও স্পেশাল গ্রুমিং
    {
      name: "দাড়ি ট্রিমিং ও লাইন শেপিং",
      slug: "beard-trimming-shaping",
      categorySlug: "beard-grooming",
      description: "রেজর শার্প বিয়ার্ড আউটলাইন, শেপিং ও কন্ডিশনিং বাম প্রয়োগ।",
      priceMinor: 15000, // ৳ 150
      durationMinutes: 20,
      bufferAfterMinutes: 5,
      isFeatured: true,
    },
    {
      name: "রয়্যাল হট টাওয়েল শেভ",
      slug: "royal-hot-towel-shave",
      categorySlug: "beard-grooming",
      description: "হট স্টিম টাওয়েল, প্রি-শেভ অয়েল, ফোম শেভ ও কুলিং আফটারশেভ বাম।",
      priceMinor: 25000, // ৳ 250
      durationMinutes: 25,
      bufferAfterMinutes: 5,
      isFeatured: false,
    },
    {
      name: "বিয়ার্ড স্পা ও নারিশিং থেরাপি",
      slug: "beard-spa-nourishing",
      categorySlug: "beard-grooming",
      description: "দাড়ির শুষ্কতা দূর করতে অর্গানিক অয়েল ম্যাসাজ ও হট টাওয়েল থেরাপি।",
      priceMinor: 40000, // ৳ 400
      durationMinutes: 30,
      bufferAfterMinutes: 5,
      isFeatured: false,
    },

    // ফেসিয়াল ও স্কিন কেয়ার
    {
      name: "গোল্ড গ্লো প্রিমিয়াম ফেসিয়াল",
      slug: "gold-glow-facial",
      categorySlug: "facial-skin-care",
      description: "২৪ ক্যারেট গোল্ড ফেসিয়াল কিট দিয়ে ডিপ ক্লিনজিং, স্ক্রাব ও গ্লোয়িং ফেস প্যাক।",
      priceMinor: 120000, // ৳ 1,200
      durationMinutes: 50,
      bufferAfterMinutes: 10,
      isFeatured: true,
    },
    {
      name: "হার্বাল অ্যান্টি-একনে ফেসিয়াল",
      slug: "herbal-anti-acne-facial",
      categorySlug: "facial-skin-care",
      description: "নিম, তুলসী ও টি-ট্রি উপাদান দিয়ে ব্রণ ও অতিরিক্ত তৈলাক্ততা দূর করার ট্রিটমেন্ট।",
      priceMinor: 95000, // ৳ 950
      durationMinutes: 45,
      bufferAfterMinutes: 5,
      isFeatured: false,
    },
    {
      name: "ডিপ ক্লিনজিং ডি-ট্যান ফেসিয়াল",
      slug: "deep-cleansing-detan",
      categorySlug: "facial-skin-care",
      description: "রোদে পোড়া দাগ দূরীকরণ, ব্ল্যাকহেডস রিমুভাল ও ভিটামিন সি সিরাম ম্যাসাজ।",
      priceMinor: 85000, // ৳ 850
      durationMinutes: 40,
      bufferAfterMinutes: 5,
      isFeatured: true,
    },

    // হেয়ার কালার ও স্পা
    {
      name: "অ্যামোনিয়া-মুক্ত প্রিমিয়াম হেয়ার কালার",
      slug: "ammonia-free-hair-color",
      categorySlug: "hair-color-spa",
      description: "লরিয়াল অ্যামোনিয়া-মুক্ত প্রফেশনাল হেয়ার ডাই ও শাইন ট্রিটমেন্ট।",
      priceMinor: 120000, // ৳ 1,200
      durationMinutes: 60,
      bufferAfterMinutes: 10,
      isFeatured: true,
    },
    {
      name: "ডিপ কন্ডিশনিং হেয়ার স্পা",
      slug: "deep-conditioning-hair-spa",
      categorySlug: "hair-color-spa",
      description: "শুষ্ক ও ক্ষতিগ্রস্ত চুলের জন্য পুষ্টিকর প্রোটিন ক্রিম ম্যাসাজ ও হেয়ার স্টিম।",
      priceMinor: 80000, // ৳ 800
      durationMinutes: 45,
      bufferAfterMinutes: 5,
      isFeatured: false,
    },
    {
      name: "কেরাটিন হেয়ার স্মুথেনিং ট্রিটমেন্ট",
      slug: "keratin-hair-treatment",
      categorySlug: "hair-color-spa",
      description: "চুলের ফ্রিজিনেস দূর করে সিল্কি, সোজা ও স্বাস্থ্যোজ্জ্বল করার পূর্ণাঙ্গ কেরাটিন কেয়ার।",
      priceMinor: 250000, // ৳ 2,500
      durationMinutes: 90,
      bufferAfterMinutes: 10,
      isFeatured: false,
    },

    // ব্রাইডাল ও পার্টি মেকআপ
    {
      name: "ব্রাইডাল এক্সক্লুসিভ মেকওভার",
      slug: "bridal-exclusive-makeover",
      categorySlug: "bridal-makeup",
      description: "এইচডি ব্রাইডাল মেকআপ, আইল্যাশ, হেয়ার সেটিং, জুয়েলারি ও শাড়ি পরা অন্তর্ভুক্ত।",
      priceMinor: 450000, // ৳ 4,500
      durationMinutes: 120,
      bufferAfterMinutes: 15,
      isFeatured: true,
    },
    {
      name: "পার্টি মেকআপ ও হেয়ার ডু",
      slug: "party-makeup-hairdo",
      categorySlug: "bridal-makeup",
      description: "যেকোনো উৎসব বা অনুষ্ঠানের জন্য গর্জিয়াস পার্টি মেকআপ ও আকর্ষণীয় হেয়ার স্টাইল।",
      priceMinor: 180000, // ৳ 1,800
      durationMinutes: 60,
      bufferAfterMinutes: 10,
      isFeatured: false,
    },

    // স্পা ও রিল্যাক্সেশন
    {
      name: "রিল্যাক্সিং হেড ও শোল্ডার ম্যাসাজ",
      slug: "head-shoulder-massage",
      categorySlug: "spa-massage",
      description: "অ্যারোমা অয়েল দিয়ে মাথার ত্বক ও কাঁধের প্রেসার পয়েন্ট ম্যাসাজ। মানসিক চাপ দূর করে।",
      priceMinor: 60000, // ৳ 600
      durationMinutes: 30,
      bufferAfterMinutes: 5,
      isFeatured: false,
    },
    {
      name: "ফুল বডি আয়ুর্বেদিক স্পা",
      slug: "full-body-ayurvedic-spa",
      categorySlug: "spa-massage",
      description: "ভেষজ তেল ও থেরাপিউটিক ম্যাসাজের মাধ্যমে রক্ত সঞ্চালন ও মাংসপেশির প্রশান্তি।",
      priceMinor: 200000, // ৳ 2,000
      durationMinutes: 75,
      bufferAfterMinutes: 10,
      isFeatured: false,
    },

    // ম্যানিকিউর ও পেডিকিউর
    {
      name: "ডিলাক্স স্পা ম্যানিকিউর",
      slug: "deluxe-spa-manicure",
      categorySlug: "manicure-pedicure",
      description: "হাতের নখ শেপিং, কিউটিকেল কেয়ার, স্ক্রাবিং ও নারিশিং হ্যান্ড ম্যাসাজ।",
      priceMinor: 50000, // ৳ 500
      durationMinutes: 35,
      bufferAfterMinutes: 5,
      isFeatured: false,
    },
    {
      name: "স্পা পেডিকিউর ও ফুট স্ক্রাব",
      slug: "spa-pedicure-foot-scrub",
      categorySlug: "manicure-pedicure",
      description: "পা ও গোড়ালির মৃতকোষ দূরীকরণ, সল্ট সোয়াক ও রিল্যাক্সিং ফুট ম্যাসাজ।",
      priceMinor: 65000, // ৳ 650
      durationMinutes: 40,
      bufferAfterMinutes: 5,
      isFeatured: true,
    },
  ];

  let addedCount = 0;
  for (const s of demoServicesList) {
    const catId = categoryMap[s.categorySlug];
    if (catId) {
      await Service.findOneAndUpdate(
        { slug: s.slug },
        {
          name: s.name,
          slug: s.slug,
          categoryId: catId,
          description: s.description,
          priceMinor: s.priceMinor,
          durationMinutes: s.durationMinutes,
          bufferBeforeMinutes: 0,
          bufferAfterMinutes: s.bufferAfterMinutes,
          assignedStaffIds: staffIds,
          isActive: true,
          isFeatured: s.isFeatured,
          onlineBookingEnabled: true,
        },
        { upsert: true, new: true }
      );
      addedCount++;
    }
  }

  // 5. Seed Demo Inventory Products (for POS checkout demo)
  const demoProducts = [
    {
      name: "লরিয়াল প্রফেশনাল হেয়ার সিরাম (১০০ মি.লি.)",
      sku: "LOR-SER-100",
      category: "হেয়ার কেয়ার",
      costPriceMinor: 45000,
      sellingPriceMinor: 65000,
      currentStock: 25,
      reorderLevel: 5,
      unit: "বোতল",
      isActive: true,
    },
    {
      name: "ম্যাট ফিনিশ হেয়ার ক্লে ওয়াক্স (৫০ গ্রাম)",
      sku: "WAX-MAT-050",
      category: "হেয়ার স্টাইলিং",
      costPriceMinor: 25000,
      sellingPriceMinor: 40000,
      currentStock: 18,
      reorderLevel: 4,
      unit: "জার",
      isActive: true,
    },
    {
      name: "অর্গানিক বিয়ার্ড গ্রোথ অ্যান্ড নারিশিং অয়েল (৩০ মি.লি.)",
      sku: "BRD-OIL-030",
      category: "গ্রুমিং",
      costPriceMinor: 30000,
      sellingPriceMinor: 45000,
      currentStock: 15,
      reorderLevel: 3,
      unit: "বোতল",
      isActive: true,
    },
    {
      name: "অ্যালোভেরা হাইড্রেটিং ফেসিয়াল জেল (১৫০ গ্রাম)",
      sku: "ALV-GEL-150",
      category: "স্কিন কেয়ার",
      costPriceMinor: 20000,
      sellingPriceMinor: 35000,
      currentStock: 30,
      reorderLevel: 5,
      unit: "টিউব",
      isActive: true,
    },
  ];

  for (const prod of demoProducts) {
    await Product.findOneAndUpdate(
      { sku: prod.sku },
      prod,
      { upsert: true, new: true }
    );
  }

  return {
    categoriesCount: demoCategories.length,
    servicesCount: addedCount,
    staffCount: createdStaff.length,
    productsCount: demoProducts.length,
  };
}
