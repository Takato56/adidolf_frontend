"use client"

import { usePathname } from "next/navigation"
import Link from "next/link";

export default function Tab({ label, href, className }: { label: string, href: string, className?: string }) {
  const isActive = href === usePathname();

  return (
    <Link key={label} href={href} className={`transition-colors duration-300 underline-offset-6 decoration-2 ${isActive ? "underline text-[#0f172A]" : "hover:underline hover:text-[#0f172A]"} ${className}`}>{label}</Link>
  )
}