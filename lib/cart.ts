// FILE: takato56-adidolf_frontend/lib/cart.ts

import { fetchWithAuth } from '@/lib/auth';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiCartItem {
  cart_item_id: number;
  product_id: number;
  variant_id: number | null;
  quantity: number;
  added_at: string;
  unit_price: number;
  subtotal: number;
  product: {
    product_id: number;
    name: string;
    slug: string;
    base_price: number;
    is_published: boolean;
    primary_image: string | null;
  };
  variant: {
    variant_id: number;
    sku: string;
    color: string | null;
    size: string | null;
    extra_price: number;
    stock_quantity: number;
    image_url: string | null;
  } | null;
}

export interface ApiCartSummary {
  cart_id: number;
  items: ApiCartItem[];
  subtotal: number;
  total_items: number;
}

async function unwrap<T>(res: Response, fallbackMessage: string): Promise<T> {
  if (!res.ok) {
    let message = fallbackMessage;
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // ignore body parse errors
    }
    throw new Error(`${message} (${res.status})`);
  }
  const json = await res.json();
  return json.data as T;
}

export async function getCartApi(): Promise<ApiCartSummary> {
  const res = await fetchWithAuth(`${BASE_URL}/cart`);
  return unwrap<ApiCartSummary>(res, 'Failed to fetch cart');
}

export async function addCartItemApi(
  productId: number,
  variantId: number,
  quantity: number
): Promise<ApiCartSummary> {
  const res = await fetchWithAuth(`${BASE_URL}/cart/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: productId,
      variant_id: variantId,
      quantity,
    }),
  });
  return unwrap<ApiCartSummary>(res, 'Failed to add item to cart');
}

export async function updateCartItemQuantityApi(
  itemId: number,
  quantity: number
): Promise<ApiCartSummary> {
  const res = await fetchWithAuth(`${BASE_URL}/cart/items/${itemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  return unwrap<ApiCartSummary>(res, 'Failed to update item quantity');
}

export async function removeCartItemApi(
  itemId: number
): Promise<ApiCartSummary> {
  const res = await fetchWithAuth(`${BASE_URL}/cart/items/${itemId}`, {
    method: 'DELETE',
  });
  return unwrap<ApiCartSummary>(res, 'Failed to remove item from cart');
}

export async function clearCartApi(): Promise<ApiCartSummary> {
  const res = await fetchWithAuth(`${BASE_URL}/cart`, {
    method: 'DELETE',
  });
  return unwrap<ApiCartSummary>(res, 'Failed to clear cart');
}