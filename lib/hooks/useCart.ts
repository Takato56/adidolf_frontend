'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getCartApi,
  addCartItemApi,
  updateCartItemQuantityApi,
  removeCartItemApi,
  clearCartApi,
  ApiCartItem,
} from '@/lib/cart';
import { validateVoucherApi } from '@/lib/vouchers';

// The cart is now real and server-side (GET/POST/PATCH/DELETE /cart, tied
// to the logged-in user) — this hook is just a thin client wrapper around
// it. It requires the user to be logged in; every call will 401 otherwise.
export function useCart() {
  const [cartId, setCartId] = useState<number | null>(null);
  const [items, setItems] = useState<ApiCartItem[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The voucher isn't persisted against the cart server-side — it's just a
  // live preview via POST /vouchers/validate. The code only gets "really"
  // applied when it's passed along to POST /orders at checkout.
  const [voucherCode, setVoucherCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);

  const applyFromSummary = (summary: {
    cart_id: number;
    items: ApiCartItem[];
    subtotal: number;
  }) => {
    setCartId(summary.cart_id);
    setItems(summary.items);
    setSubtotal(summary.subtotal);
  };

  const load = useCallback(async () => {
    setError(null);
    try {
      const summary = await getCartApi();
      applyFromSummary(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cart');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addItem = async (productId: number, variantId: number, quantity: number) => {
    const summary = await addCartItemApi(productId, variantId, quantity);
    applyFromSummary(summary);
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    const summary = await updateCartItemQuantityApi(itemId, quantity);
    applyFromSummary(summary);
  };

  const removeItem = async (itemId: number) => {
    const summary = await removeCartItemApi(itemId);
    applyFromSummary(summary);
  };

  const removeVoucher = () => {
    setVoucherCode(null);
    setDiscountAmount(0);
    setVoucherError(null);
  };

  const clearCart = async () => {
    await clearCartApi();
    setItems([]);
    setSubtotal(0);
    removeVoucher();
  };

  const applyVoucherCode = async (code: string) => {
    setVoucherError(null);
    setIsApplyingVoucher(true);
    try {
      const result = await validateVoucherApi(code);
      if (!result.valid) {
        setVoucherCode(null);
        setDiscountAmount(0);
        setVoucherError(result.reason || 'This voucher cannot be applied.');
        return;
      }
      setVoucherCode(code);
      setDiscountAmount(result.discount_amount);
    } catch (err) {
      setVoucherCode(null);
      setDiscountAmount(0);
      setVoucherError(err instanceof Error ? err.message : 'Failed to apply voucher');
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  return {
    cartId,
    items,
    subtotal,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    isLoaded,
    error,
    refetch: load,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    voucherCode,
    discountAmount,
    voucherError,
    isApplyingVoucher,
    applyVoucherCode,
    removeVoucher,
  };
}