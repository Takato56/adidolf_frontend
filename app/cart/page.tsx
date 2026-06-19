"use client";

import { useState } from "react";
import Link from "next/link";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";

// Mock Data

interface CartItem {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
}

const INITIAL_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "Suspiciously Branded Shirt",
    category: "Politics",
    price: 4900000000000000000000.0,
    quantity: 2,
    size: "L",
    color: "Black",
    image: "#1a1a1a",
  }
];

const SHIPPING_THRESHOLD = 200;
const SHIPPING_FEE = 15;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);

  function updateQty(id: number, delta: number) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const freeShippingLeft = SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="min-h-screen bg-surface">
      {/* ── Page header ── */}
      <div className="border-b border-border-divider px-4 md:px-20 py-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold">Your Cart</h1>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
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
              <div className="bg-surface-secondary rounded-lg px-4 py-3 text-sm text-text-muted">
                Spend{" "}
                <span className="font-semibold text-text-primary">
                  ${freeShippingLeft.toFixed(2)}
                </span>{" "}
                more for free shipping.
                <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-text-primary rounded-full transition-all duration-300"
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
                key={item.id}
                item={item}
                onUpdateQty={updateQty}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* ── Order summary ── */}
          <div className="bg-surface-card border border-border rounded-xl p-6 space-y-4 sticky top-4">
            <h2 className="text-lg font-extrabold text-text-primary">Order Summary</h2>

            <div className="space-y-2 text-sm text-text-muted">
              <div className="flex justify-between">
                <span>
                  Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                </span>
                <span className="font-medium text-text-primary">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium text-text-primary">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
            </div>

            <div className="border-t border-border-divider pt-4 flex justify-between font-extrabold text-base text-text-primary">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              className="block w-full bg-text-primary text-surface-header text-sm font-semibold text-center py-3 rounded-lg hover:bg-text-secondary transition-colors"
            >
              Proceed to Checkout
            </Link>

            <p className="text-xs text-text-muted text-center">
              Taxes calculated at checkout
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
  onUpdateQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="flex gap-4 bg-surface-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow">
      {/* Image placeholder */}
      <div
        className="w-24 h-24 rounded-lg flex-shrink-0"
        style={{ backgroundColor: item.image }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-sm text-text-primary leading-tight">
              {item.name}
            </p>
            <p className="text-xs text-text-muted mt-0.5">{item.category}</p>
          </div>
          <p className="font-extrabold text-sm text-text-primary whitespace-nowrap">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs bg-surface-secondary text-text-muted px-2 py-0.5 rounded">
            {item.size}
          </span>
          <span className="text-xs bg-surface-secondary text-text-muted px-2 py-0.5 rounded">
            {item.color}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity */}
          <div className="flex items-center gap-2 border border-border rounded-lg px-2 py-1">
            <button
              onClick={() => onUpdateQty(item.id, -1)}
              className="text-text-muted hover:text-text-primary transition-colors p-0.5"
            >
              <FaMinus className="text-[10px]" />
            </button>
            <span className="text-sm font-semibold w-5 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.id, 1)}
              className="text-text-muted hover:text-text-primary transition-colors p-0.5"
            >
              <FaPlus className="text-[10px]" />
            </button>
          </div>

          {/* Remove */}
          <button
            onClick={() => onRemove(item.id)}
            className="text-text-muted hover:text-red-400 transition-colors text-xs flex items-center gap-1.5"
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
      <div className="w-16 h-16 rounded-full bg-surface-secondary flex items-center justify-center mb-5">
        <svg
          className="w-7 h-7 text-text-muted"
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
      <p className="text-sm text-text-muted mb-6">
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