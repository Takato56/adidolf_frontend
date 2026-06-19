"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Tab({
  label,
  href,
  className,
}: {
  label: string;
  href: string;
  className?: string;
}) {
  const isActive = href === usePathname();

  return (
    <Link
      href={href}
      className={`transition-colors duration-300 underline-offset-6 decoration-2 ${
        isActive
          ? "underline text-text-primary"
          : "hover:underline hover:text-text-primary"
      } ${className}`}
    >
      {label}
    </Link>
  );
}
