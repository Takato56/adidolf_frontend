'use client';

import { useCallback, useEffect, useState } from 'react';
import { Voucher } from '@/types';
import { lookupVoucherByCode } from '@/lib/vouchers';
import { evaluateVoucher } from '@/lib/utils/voucherLogic';

const ITEMS_KEY = 'cart_items';
const VOUCHER_KEY = 'cart_voucher_code';

export interface CartItem {
  key: string; // `${productId}:${variantId ?? 'default'}` — used for dedupe/updates
  productId: string;
  variantId?: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number;
  quantity: number;
  size?: string;
  color?: string;
  stock?: number;
}

function readItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ITEMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// The backend has no customer-facing cart endpoint (/carts and /cart-items
// are both admin-only), so this cart is entirely client-side, scoped to
// this browser. It won't sync across devices and won't survive clearing
// site data — a real fix needs the backend to add customer-scoped cart
// routes.
export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  useEffect(() => {
    setItems(readItems());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cartchange'));
  }, [items, isLoaded]);

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const applyVoucherCode = useCallback(
    async (code: string) => {
      setVoucherError(null);
      setIsApplyingVoucher(true);
      try {
        const found = await lookupVoucherByCode(code);
        const evaluation = evaluateVoucher(found, subtotal);
        if (!evaluation.eligible) {
          setVoucher(null);
          localStorage.removeItem(VOUCHER_KEY);
          setVoucherError(evaluation.reason || 'This voucher cannot be applied.');
          return;
        }
        setVoucher(found);
        localStorage.setItem(VOUCHER_KEY, found.code);
      } catch (err) {
        setVoucher(null);
        localStorage.removeItem(VOUCHER_KEY);
        setVoucherError(err instanceof Error ? err.message : 'Failed to apply voucher');
      } finally {
        setIsApplyingVoucher(false);
      }
    },
    [subtotal]
  );

  // Re-validate a previously-applied voucher code once the cart has loaded
  // (e.g. after a refresh) — subtotal may have changed since it was saved.
  useEffect(() => {
    if (!isLoaded) return;
    const storedCode = localStorage.getItem(VOUCHER_KEY);
    if (storedCode && !voucher) {
      applyVoucherCode(storedCode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const removeVoucher = useCallback(() => {
    setVoucher(null);
    setVoucherError(null);
    localStorage.removeItem(VOUCHER_KEY);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'key'>) => {
    const key = `${item.productId}:${item.variantId ?? 'default'}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, key }];
    });
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    removeVoucher();
  }, [removeVoucher]);

  const evaluation = voucher ? evaluateVoucher(voucher, subtotal) : null;
  const discountAmount = evaluation?.eligible ? evaluation.discountAmount : 0;

  return {
    items,
    isLoaded,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    voucher,
    voucherError,
    isApplyingVoucher,
    discountAmount,
    applyVoucherCode,
    removeVoucher,
  };
}