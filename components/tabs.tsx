"use client"

import { usePathname } from "next/navigation"
import Link from "next/link";

import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
});

export default function Tabs({ tabs }: { tabs: {label: string, href: string}[] }) {
  return (
    <div className={`hidden md:flex justify-self-center gap-8 text-sm text-[#64748B] font-medium whitespace-nowrap ${inter.className}`}>
      {
        tabs.map(tab => {
          const isActive = tab.href === usePathname();
          return <Link key={tab.label} href={tab.href} className={`transition-colors duration-300 underline-offset-6 decoration-2 ${isActive ? "underline text-[#0f172A]" : "hover:underline hover:text-[#0f172A]"}`}>{tab.label}</Link>
        })
      }
    </div>
  )
}