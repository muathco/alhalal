import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "الحلال — سوق المواشي الموثوق",
  description:
    "اطلب ذبيحتك من حضيرة موثوقة — تصفح الحضائر، قارن الأسعار، وتابع ذبيحتك خطوة بخطوة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
