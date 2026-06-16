import { Order, OrderItem } from '@/types';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'admin_orders';

const today = new Date().toISOString().split('T')[0];

const defaultOrders: Order[] = [
  {
    id: 1,
    userId: 1,
    addressId: 1,
    voucherId: 0,
    status: 'done',
    subtotal: 109.98,
    discountAmount: 10,
    shippingFee: 5.99,
    totalPrice: 105.97,
    note: '',
    createdAt: today + 'T10:30:00.000Z',
    items: [
      {
        id: 1,
        productId: 1,
        variantId: 1,
        productName: 'Premium Cotton T-Shirt',
        variantInfo: 'Navy / M',
        unitPrice: 29.99,
        quantity: 2,
        subtotal: 59.98,
      },
      {
        id: 2,
        productId: 3,
        variantId: 5,
        productName: 'Summer Casual Shorts',
        variantInfo: 'Khaki / L',
        unitPrice: 39.99,
        quantity: 1,
        subtotal: 39.99,
      },
    ],
  },
  {
    id: 2,
    userId: 2,
    addressId: 2,
    voucherId: 1,
    status: 'shipping',
    subtotal: 289.98,
    discountAmount: 25,
    shippingFee: 0,
    totalPrice: 264.98,
    note: 'Gift wrap please',
    createdAt: today + 'T14:15:00.000Z',
    items: [
      {
        id: 3,
        productId: 5,
        variantId: 9,
        productName: 'Vintage Leather Jacket',
        variantInfo: 'Brown / L',
        unitPrice: 209.99,
        quantity: 1,
        subtotal: 209.99,
      },
      {
        id: 4,
        productId: 2,
        variantId: 3,
        productName: 'Classic Blue Denim Jeans',
        variantInfo: 'Dark Blue / 32',
        unitPrice: 79.99,
        quantity: 1,
        subtotal: 79.99,
      },
    ],
  },
  {
    id: 3,
    userId: 1,
    addressId: 1,
    voucherId: 0,
    status: 'pending',
    subtotal: 49.99,
    discountAmount: 0,
    shippingFee: 4.99,
    totalPrice: 54.98,
    note: '',
    createdAt: today + 'T09:00:00.000Z',
    items: [
      {
        id: 5,
        productId: 4,
        variantId: 6,
        productName: 'Elegant Formal Shirt',
        variantInfo: 'White / L',
        unitPrice: 89.99,
        quantity: 1,
        subtotal: 89.99,
      },
    ],
  },
];

function migrateOrderId(raw: any): number {
  if (typeof raw.id === 'number') return raw.id;
  if (typeof raw.id === 'string') {
    // Try extracting a numeric suffix, e.g. "ORD-12345" -> 12345
    const match = raw.id.match(/(\d+)$/);
    if (match) return parseInt(match[1], 10);
  }
  return 0;
}

function migrateItemId(raw: any): number {
  if (typeof raw.id === 'number') return raw.id;
  if (typeof raw.id === 'string') {
    const match = raw.id.match(/(\d+)$/);
    if (match) return parseInt(match[1], 10);
  }
  return 0;
}

function migrateOrder(raw: any): Order {
  return {
    id: migrateOrderId(raw),
    userId: typeof raw.userId === 'number' ? raw.userId : 0,
    addressId: typeof raw.addressId === 'number' ? raw.addressId : 0,
    voucherId: typeof raw.voucherId === 'number' ? raw.voucherId : 0,
    status: ['pending', 'confirmed', 'shipping', 'done', 'cancelled'].includes(
      raw.status
    )
      ? raw.status
      : 'pending',
    subtotal: typeof raw.subtotal === 'number' ? raw.subtotal : 0,
    discountAmount:
      typeof raw.discountAmount === 'number' ? raw.discountAmount : 0,
    shippingFee: typeof raw.shippingFee === 'number' ? raw.shippingFee : 0,
    totalPrice: typeof raw.totalPrice === 'number' ? raw.totalPrice : 0,
    note: raw.note || '',
    createdAt: raw.createdAt || new Date().toISOString(),
    items: Array.isArray(raw.items) ? raw.items.map(migrateItem) : [],
  };
}

function migrateItem(raw: any): OrderItem {
  return {
    id: migrateItemId(raw),
    productId: typeof raw.productId === 'number' ? raw.productId : 0,
    variantId:
      raw.variantId === null || raw.variantId === undefined || raw.variantId === ''
        ? null
        : typeof raw.variantId === 'number'
        ? raw.variantId
        : parseInt(String(raw.variantId)) || null,
    productName: raw.productName || '',
    variantInfo: raw.variantInfo || null,
    unitPrice: typeof raw.unitPrice === 'number' ? raw.unitPrice : 0,
    quantity: typeof raw.quantity === 'number' ? raw.quantity : 0,
    subtotal: typeof raw.subtotal === 'number' ? raw.subtotal : 0,
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Persistent ID counters seeded from existing data
  const nextOrderId = useRef(100);
  const nextItemId = useRef(Date.now());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      let parsedOrders: Order[];
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsedOrders = Array.isArray(parsed)
            ? parsed.map(migrateOrder)
            : defaultOrders;
        } catch {
          parsedOrders = defaultOrders;
        }
      } else {
        parsedOrders = defaultOrders;
      }
      // Seed counters from existing data to avoid key collisions
      nextOrderId.current =
        Math.max(...parsedOrders.map((o) => o.id), 0) + 1;
      const maxItemId = Math.max(
        ...parsedOrders.flatMap((o) => o.items.map((i) => i.id)),
        0
      );
      nextItemId.current = maxItemId + 1;
      setOrders(parsedOrders);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  const addOrder = (
    order: Omit<Order, 'id' | 'subtotal' | 'totalPrice'>
  ) => {
    const fullItems: OrderItem[] = order.items.map((item, idx) => ({
      ...item,
      id: nextItemId.current++,
      subtotal: item.unitPrice * item.quantity,
    }));
    const subtotal = fullItems.reduce((sum, i) => sum + i.subtotal, 0);
    const totalPrice = subtotal - order.discountAmount + order.shippingFee;

    const newOrder: Order = {
      ...order,
      id: nextOrderId.current++,
      subtotal,
      totalPrice,
      items: fullItems,
    };
    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrder = (id: number, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const merged = { ...o, ...updates };
        if (updates.items) {
          const subtotal = updates.items.reduce(
            (sum, i) => sum + (i.subtotal ?? i.unitPrice * i.quantity),
            0
          );
          const totalPrice =
            subtotal - merged.discountAmount + merged.shippingFee;
          return { ...merged, subtotal, totalPrice };
        }
        return merged;
      })
    );
  };

  const deleteOrder = (id: number) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const getOrder = (id: number) => {
    return orders.find((o) => o.id === id);
  };

  return {
    orders,
    isLoaded,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrder,
  };
}