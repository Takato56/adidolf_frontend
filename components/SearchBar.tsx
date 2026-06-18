"use client";

import { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import Link from "next/link";

const MOCK_PRODUCTS = [
  { id: 1, name: "Cool Looking Lapel", category: "Accessories", price: "$4,000,000", href: "/support/nuremberg" },
  { id: 2, name: "Suspiciously Branded Shirt", category: "Politics", price: "$29.99", href: "/" },
  { id: 3, name: "Olive Field Jacket", category: "Menswear", price: "$149.99", href: "/" },
  { id: 4, name: "Heritage Sneakers", category: "Footwear", price: "$89.99", href: "/" },
  { id: 5, name: "Tactical Tote Bag", category: "Accessories", price: "$59.99", href: "/" },
  { id: 6, name: "Statement Cap", category: "Accessories", price: "$34.99", href: "/" },
];

export default function SearchBar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      inputRef.current?.focus();
    }
  }, [open]);

  const results = query.trim()
    ? MOCK_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  if (!open) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/10"
        onClick={onClose}
      />

      {/* Search bar + results */}
      <div className="absolute top-0 left-0 w-full z-50 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3 px-6 h-14">
          <FaSearch className="text-slate-400 text-sm flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-black transition-colors">
            <FaTimes />
          </button>
        </div>

        {query.trim() && (
          <div className="border-t border-slate-100">
            {results.length === 0 ? (
              <div className="px-6 py-4 text-sm text-slate-400">
                No products found for &quot;{query}&quot;
              </div>
            ) : (
              results.map((p) => (
                <Link
                  key={p.id}
                  href={p.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="w-9 h-9 rounded-md bg-slate-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{p.name}</p>
                    <p className="text-xs text-slate-400">{p.category}</p>
                  </div>
                  <span className="text-sm font-semibold text-black">{p.price}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}