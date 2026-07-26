"use client";

import { useState } from "react";
import Link from "next/link";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import { useCart, CartItem } from "@/lib/hooks/useCart";

const SHIPPING_THRESHOLD = 200;
const SHIPPING_FEE = 15;

export default function CartPage() {
  const { items, isLoaded, removeItem, updateQuantity, subtotal } = useCart();

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const freeShippingLeft = SHIPPING_THRESHOLD - subtotal;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#fbfdff] flex items-center justify-center">
        <p className="text-slate-400">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfdff]">
      {/* ── Page header ── */}
      <div className="border-b border-slate-100 px-4 md:px-20 py-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold">Your Cart</h1>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-black transition-colors"
        >
          <FaArrowLeft className="text-xs" />
          Continue shopping
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="px-4 md:px-20 py-8 grid md:grid-cols-[1fr_340px] gap-10 items-start">
          {/* ── Item list ── */}
          <div className="space-y-4">
            {/* Free shipping progress */}
            {freeShippingLeft > 0 && (
              <div className="bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-600">
                Spend{" "}
                <span className="font-semibold text-black">
                  ${freeShippingLeft.toFixed(2)}
                </span>{" "}
                more for free shipping.
                <div className="mt-2 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        (subtotal / SHIPPING_THRESHOLD) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {freeShippingLeft <= 0 && (
              <div className="bg-green-50 rounded-lg px-4 py-3 text-sm text-green-700 font-medium">
                ✓ You've unlocked free shipping!
              </div>
            )}

            {/* Items */}
            {items.map((item) => (
              <CartRow
                key={item.key}
                item={item}
                onUpdateQty={(key, delta) =>
                  updateQuantity(key, item.quantity + delta)
                }
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* ── Order summary ── */}
          <div className="bg-white border border-slate-100 rounded-xl p-6 space-y-4 sticky top-4">
            <h2 className="text-lg font-extrabold">Order Summary</h2>

            <div className="space-y-2 text-sm text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="font-medium text-black">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-black">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between font-extrabold text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-black text-white text-sm font-semibold text-center py-3 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Proceed to Checkout
            </Link>

            <p className="text-xs text-slate-400 text-center">
              Coupon codes can be applied at checkout
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Cart Row ─────────────────────────────────────────────────────────────────

function CartRow({
  item,
  onUpdateQty,
  onRemove,
}: {
  item: CartItem;
  onUpdateQty: (key: string, delta: number) => void;
  onRemove: (key: string) => void;
}) {
  return (
    <div className="flex gap-4 bg-white border border-slate-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
      <div className="w-24 h-24 rounded-lg flex-shrink-0 bg-slate-100 overflow-hidden">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              href={`/products?slug=${encodeURIComponent(item.slug)}`}
              className="font-semibold text-sm text-black leading-tight hover:underline"
            >
              {item.name}
            </Link>
          </div>
          <p className="font-extrabold text-sm whitespace-nowrap">
            ${(item.unitPrice * item.quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          {item.size && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {item.size}
            </span>
          )}
          {item.color && (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {item.color}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-2 py-1">
            <button
              onClick={() => onUpdateQty(item.key, -1)}
              className="text-slate-400 hover:text-black transition-colors p-0.5"
            >
              <FaMinus className="text-[10px]" />
            </button>
            <span className="text-sm font-semibold w-5 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.key, 1)}
              disabled={item.stock !== undefined && item.quantity >= item.stock}
              className="text-slate-400 hover:text-black transition-colors p-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <FaPlus className="text-[10px]" />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => onRemove(item.key)}
            className="text-slate-300 hover:text-red-400 transition-colors text-xs flex items-center gap-1.5"
          >
            <FaTrash />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-5">
        <svg
          className="w-7 h-7 text-slate-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6h13M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-extrabold mb-2">Your cart is empty</h2>
      <p className="text-sm text-slate-400 mb-6">
        Looks like you haven't added anything yet.
      </p>
      <Link
        href="/"
        className="bg-black text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-neutral-800 transition-colors"
      >
        Start shopping
      </Link>
    </div>
  );
}