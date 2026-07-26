"use client";

import { useState, useRef, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { useProducts } from "@/lib/hooks/useProducts";
import { toProductCardData } from "@/lib/adapters/productDisplay";

export default function SearchBar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { products, isLoaded } = useProducts();

  useEffect(() => {
    if (open) {
      setQuery("");
      inputRef.current?.focus();
    }
  }, [open]);

  const trimmedQuery = query.trim().toLowerCase();

  const results = trimmedQuery
    ? products
        .filter(
          (p) =>
            p.isPublished &&
            (p.name.toLowerCase().includes(trimmedQuery) ||
              p.brand.toLowerCase().includes(trimmedQuery) ||
              p.categorySlug.toLowerCase().includes(trimmedQuery))
        )
        .slice(0, 8)
        .map(toProductCardData)
    : [];

  if (!open) return null;

  return (
    <>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 z-40 bg-black/10" onClick={onClose} />

      {/* Compact search dropdown, anchored under the search icon instead of
          spanning the full header width */}
      <div className="absolute top-full right-6 mt-2 w-80 md:w-96 z-50 bg-white border border-slate-100 rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center gap-3 px-4 h-12 border-b border-slate-100">
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

        {trimmedQuery && (
          <div className="max-h-96 overflow-y-auto">
            {!isLoaded ? (
              <div className="px-4 py-4 text-sm text-slate-400">Loading...</div>
            ) : results.length === 0 ? (
              <div className="px-4 py-4 text-sm text-slate-400">
                No products found for &quot;{query}&quot;
              </div>
            ) : (
              results.map((p, index) => (
                <Link
                  key={index}
                  href={p.shopLink}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="w-9 h-9 rounded-md bg-slate-100 flex-shrink-0 overflow-hidden">
                    {p.image && (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">{p.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{p.category}</p>
                  </div>
                  <span className="text-sm font-semibold text-black">${p.price}</span>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}