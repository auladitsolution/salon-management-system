import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "সেলুন বুকিং ও ম্যানেজমেন্ট সিস্টেম | Aulad IT Solution",
  description: "আধুনিক, নির্ভরযোগ্য ও পূর্ণাঙ্গ সেলুন ও পার্লার ম্যানেজমেন্ট সলিউশন।",
  keywords: "salon booking, beauty parlour, salon management, bangladesh salon, সেলুন বুকিং, পার্লার ম্যানেজমেন্ট",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <body className="font-sans min-h-screen flex flex-col bg-salon-cream text-salon-dark antialiased">
        {children}
      </body>
    </html>
  );
}
