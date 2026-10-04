# Client Handover Guide
**Salon Booking & Management System - Aulad IT Solution**

## 1. Handover Overview
This document guides the final transition of the deployed salon system from Aulad IT Solution engineering team to the salon owner and operational management.

### Key Ownership Principles:
1. **The Client Owns Their Infrastructure:** The client maintains primary ownership of their MongoDB Atlas, Firebase, Cloudinary, and domain accounts.
2. **Zero Password Sharing:** No permanent administrative passwords are held by Aulad IT Solution staff after onboarding.
3. **Onboarding Training Session:** The salon owner, manager, and receptionists are trained on everyday workflows.

---

## 2. Onboarding Workflow for Salon Staff

### 2.1. Owner First Steps
1. Log in to the Admin Dashboard at `/login`.
2. Navigate to **সেটিংস (Settings)**:
   - Verify Salon Name (সেলুনের নাম), Tagline (স্লোগান), Address (ঠিকানা), and Phone (ফোন নম্বর).
   - Configure Operating Hours (খোলার ও বন্ধের সময়) and Weekly Holidays (সাপ্তাহিক ছুটির দিন).
   - Set Booking Rules (বুকিং ব্যবধান ১৫/৩০ মিনিট, অগ্রিম বুকিং সীমা).
3. Navigate to **সার্ভিসসমূহ (Services)**:
   - Review default categories and adjust service prices and durations.
4. Navigate to **কর্মচারী (Staff)**:
   - Add stylists, assign them to services, and set their work schedules and commission rates.

### 2.2. Receptionist Daily Guide
1. **বুকিং ব্যবস্থাপনা (Appointments):** View today's schedule in Calendar / Timeline view.
2. **নতুন অ্যাপয়েন্টমেন্ট (New Booking):** Take walk-in or phone reservations directly.
3. **চেক-ইন ও সার্ভিস শুরু (Check-In & Progress):** Mark arriving customers as "চেক-ইন", then "সার্ভিস চলছে", then "সম্পন্ন".
4. **বিক্রয় ও বিলিং (POS):** Click "বিল তৈরি করুন" (Generate Bill) to record cash, bKash, or card payments and print customer receipts.

---

## 3. Handover Checklist

- [ ] Client owner account verified with 2-Factor Authentication enabled.
- [ ] Bootstrap secret key invalidated or disabled in production environment.
- [ ] Custom domain SSL certificates verified.
- [ ] Test booking completed end-to-end (Guest and Registered).
- [ ] Test POS invoice generated and verified with exact poisha arithmetic.
- [ ] Test bKash / Nagad manual payment verification recorded.
- [ ] Test inventory deduction upon retail sale verified.
- [ ] Training session completed with staff.
- [ ] Emergency contact protocol handed over for technical support.
