// FILE: takato56-adidolf_frontend/lib/hooks/useCart.ts

'use client';

import { useCallback, useEffect, useState } from 'react';
import { Voucher } from '@/types';
import { validateVoucherApi } from '@/lib/vouchers';
import {
  getCartApi,
  addCartItemApi,
  updateCartItemQuantityApi,
  removeCartItemApi,
  clearCartApi,
  ApiCartItem,
} from '@/lib/cart';

const LOCAL_ITEMS_KEY = 'cart_items';
const VOUCHER_KEY = 'cart_voucher_code';

export interface CartItem {
  key: string;
  cartItemId?: number;
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

function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return !!sessionStorage.getItem('accessToken');
}

function readLocalItems(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_ITEMS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function mapApiCartItemToCartItem(item: ApiCartItem): CartItem {
  return {
    key: `api-${item.cart_item_id}`,
    cartItemId: item.cart_item_id,
    productId: String(item.product_id),
    variantId: item.variant_id ? String(item.variant_id) : undefined,
    slug: item.product.slug,
    name: item.product.name,
    image:
      item.variant?.image_url ||
      item.product.primary_image ||
      '/images/placeholder.jpg',
    unitPrice: item.unit_price,
    quantity: item.quantity,
    size: item.variant?.size || undefined,
    color: item.variant?.color || undefined,
    stock: item.variant?.stock_quantity,
  };
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  const fetchCart = useCallback(async () => {
    if (isAuthenticated()) {
      try {
        const summary = await getCartApi();
        setItems(summary.items.map(mapApiCartItemToCartItem));
      } catch (err) {
        console.warn('Backend cart sync failed, falling back to local cart:', err);
        setItems(readLocalItems());
      }
    } else {
      setItems(readLocalItems());
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    fetchCart();
    const handleAuthChange = () => fetchCart();
    window.addEventListener('authchange', handleAuthChange);
    return () => window.removeEventListener('authchange', handleAuthChange);
  }, [fetchCart]);

  useEffect(() => {
    if (!isLoaded || isAuthenticated()) return;
    localStorage.setItem(LOCAL_ITEMS_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('cartchange'));
  }, [items, isLoaded]);

  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  // ---------- Real Voucher Validation ----------
  const applyVoucherCode = useCallback(
    async (code: string) => {
      const cleanCode = code.trim().toUpperCase();
      if (!cleanCode) return;

      setVoucherError(null);
      setIsApplyingVoucher(true);

      try {
        if (isAuthenticated()) {
          const result = await validateVoucherApi(cleanCode);
          if (!result.valid) {
            setAppliedCode(null);
            setDiscountAmount(0);
            localStorage.removeItem(VOUCHER_KEY);
            setVoucherError(result.reason || 'This voucher cannot be applied.');
            return;
          }
          setAppliedCode(cleanCode);
          setDiscountAmount(result.discount_amount);
          localStorage.setItem(VOUCHER_KEY, cleanCode);
        } else {
          setVoucherError('Please log in to apply voucher codes.');
        }
      } catch (err) {
        setAppliedCode(null);
        setDiscountAmount(0);
        localStorage.removeItem(VOUCHER_KEY);
        setVoucherError(
          err instanceof Error ? err.message : 'Failed to apply voucher'
        );
      } finally {
        setIsApplyingVoucher(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!isLoaded) return;
    const storedCode = localStorage.getItem(VOUCHER_KEY);
    if (storedCode && isAuthenticated()) {
      applyVoucherCode(storedCode);
    }
  }, [isLoaded, items, applyVoucherCode]);

  const removeVoucher = useCallback(() => {
    setAppliedCode(null);
    setDiscountAmount(0);
    setVoucherError(null);
    localStorage.removeItem(VOUCHER_KEY);
  }, []);

  const addItem = useCallback(
    async (item: Omit<CartItem, 'key'>) => {
      if (isAuthenticated()) {
        const pId = Number(item.productId);
        const vId = Number(item.variantId);
        if (!pId || !vId) {
          throw new Error('Valid Product and Variant IDs are required');
        }
        const summary = await addCartItemApi(pId, vId, item.quantity);
        setItems(summary.items.map(mapApiCartItemToCartItem));
      } else {
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
      }
    },
    []
  );

  const removeItem = useCallback(
    async (key: string) => {
      const target = items.find((i) => i.key === key);
      if (isAuthenticated() && target?.cartItemId) {
        const summary = await removeCartItemApi(target.cartItemId);
        setItems(summary.items.map(mapApiCartItemToCartItem));
      } else {
        setItems((prev) => prev.filter((i) => i.key !== key));
      }
    },
    [items]
  );

  const updateQuantity = useCallback(
    async (key: string, quantity: number) => {
      const target = items.find((i) => i.key === key);
      if (quantity <= 0) {
        await removeItem(key);
        return;
      }
      if (isAuthenticated() && target?.cartItemId) {
        const summary = await updateCartItemQuantityApi(target.cartItemId, quantity);
        setItems(summary.items.map(mapApiCartItemToCartItem));
      } else {
        setItems((prev) =>
          prev.map((i) => (i.key === key ? { ...i, quantity } : i))
        );
      }
    },
    [items, removeItem]
  );

  const clearCart = useCallback(async () => {
    if (isAuthenticated()) {
      await clearCartApi();
    }
    setItems([]);
    removeVoucher();
  }, [removeVoucher]);

  const voucherObj = appliedCode
    ? ({ id: 0, code: appliedCode } as Voucher)
    : null;

  return {
    items,
    isLoaded,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    voucher: voucherObj,
    voucherCode: appliedCode,
    voucherError,
    isApplyingVoucher,
    discountAmount,
    applyVoucherCode,
    removeVoucher,
    refetchCart: fetchCart,
  };
}