import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";

import Footer from "@/components/Footer";
import Header from "@/components/Header"

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
      <body className={inter.className} >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
