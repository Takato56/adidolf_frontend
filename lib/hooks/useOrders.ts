import { Order, OrderItem } from '@/types';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'admin_orders';

const today = new Date().toISOString().split('T')[0];

const defaultOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user-1',
    addressId: 'addr-1',
    voucherId: '',
    status: 'done',
    subtotal: 109.98,
    discountAmount: 10,
    shippingFee: 5.99,
    totalPrice: 105.97,
    note: '',
    createdAt: today + 'T10:30:00.000Z',
    items: [
      {
        id: 'oi-1',
        productId: '1',
        variantId: 'v1',
        productName: 'Premium Cotton T-Shirt',
        variantInfo: 'Navy / M',
        unitPrice: 29.99,
        quantity: 2,
        subtotal: 59.98,
      },
      {
        id: 'oi-2',
        productId: '3',
        variantId: 'v5',
        productName: 'Summer Casual Shorts',
        variantInfo: 'Khaki / L',
        unitPrice: 39.99,
        quantity: 1,
        subtotal: 39.99,
      },
    ],
  },
  {
    id: 'ORD-002',
    userId: 'user-2',
    addressId: 'addr-2',
    voucherId: 'voucher-save10',
    status: 'shipping',
    subtotal: 289.98,
    discountAmount: 25,
    shippingFee: 0,
    totalPrice: 264.98,
    note: 'Gift wrap please',
    createdAt: today + 'T14:15:00.000Z',
    items: [
      {
        id: 'oi-3',
        productId: '5',
        variantId: 'v9',
        productName: 'Vintage Leather Jacket',
        variantInfo: 'Brown / L',
        unitPrice: 209.99,
        quantity: 1,
        subtotal: 209.99,
      },
      {
        id: 'oi-4',
        productId: '2',
        variantId: 'v3',
        productName: 'Classic Blue Denim Jeans',
        variantInfo: 'Dark Blue / 32',
        unitPrice: 79.99,
        quantity: 1,
        subtotal: 79.99,
      },
    ],
  },
  {
    id: 'ORD-003',
    userId: 'user-1',
    addressId: 'addr-1',
    voucherId: '',
    status: 'pending',
    subtotal: 49.99,
    discountAmount: 0,
    shippingFee: 4.99,
    totalPrice: 54.98,
    note: '',
    createdAt: today + 'T09:00:00.000Z',
    items: [
      {
        id: 'oi-5',
        productId: '4',
        variantId: 'v6',
        productName: 'Elegant Formal Shirt',
        variantInfo: 'White / L',
        unitPrice: 89.99,
        quantity: 1,
        subtotal: 89.99,
      },
    ],
  },
];

function migrateOrder(raw: any): Order {
  return {
    id: raw.id || Date.now().toString(),
    userId: raw.userId || '',
    addressId: raw.addressId || '',
    voucherId: raw.voucherId || '',
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
    items: Array.isArray(raw.items) ? raw.items : [],
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const migrated = Array.isArray(parsed)
            ? parsed.map(migrateOrder)
            : defaultOrders;
          setOrders(migrated);
        } catch {
          setOrders(defaultOrders);
        }
      } else {
        setOrders(defaultOrders);
      }
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
      id: `oi-${Date.now()}-${idx}`,
      subtotal: item.unitPrice * item.quantity,
    }));
    const subtotal = fullItems.reduce((sum, i) => sum + i.subtotal, 0);
    const totalPrice = subtotal - order.discountAmount + order.shippingFee;

    const newOrder: Order = {
      ...order,
      id: `ORD-${Date.now()}`,
      subtotal,
      totalPrice,
      items: fullItems,
    };
    setOrders((prev) => [...prev, newOrder]);
    return newOrder;
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const merged = { ...o, ...updates };
        // Recompute totals from items if items are provided
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

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const getOrder = (id: string) => {
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