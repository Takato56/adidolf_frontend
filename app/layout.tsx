import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";

import Footer from "@/components/Footer";
import Header from "@/components/Header"
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adidolf",
  description: "Express your political beliefs with fashion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Script src="https://cnpm-group-1.vercel.app/script.umd.cjs"
        data-workspace-id="13"
        data-widget-token="199ed0722206463a9b1f40f270a21cf5"
        data-api-url="https://cnpm-group-1.onrender.com/api/v1"></Script>
        <Footer />
      </body>
    </html>
  );
}