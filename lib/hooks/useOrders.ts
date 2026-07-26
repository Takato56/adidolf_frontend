import { Order, OrderItem, Shipment, Payment } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import {
  getOrdersApi,
  getOrderByIdApi,
  createOrderApi,
  updateOrderApi,
  deleteOrderApi,
  updateShipmentApi,
  updatePaymentApi,
} from '@/lib/orders';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getOrdersApi();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addOrder = async (
    order: Omit<Order, 'id' | 'subtotal' | 'totalPrice'>
  ) => {
    const created = await createOrderApi(order as any);
    setOrders((prev) => [...prev, created]);
    return created;
  };

  const updateOrder = async (id: number, updates: Partial<Order>) => {
    const updated = await updateOrderApi(id, updates);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  };

  const deleteOrder = async (id: number) => {
    await deleteOrderApi(id);
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // The list from load() doesn't carry items/shipment/payment (avoids an
  // N+1 fetch across 3 more tables just to render a table row) — use this
  // for the detail/edit page instead of getOrder().
  const fetchOrder = async (id: number): Promise<Order> => getOrderByIdApi(id);

  const getOrder = (id: number) => orders.find((o) => o.id === id);

  const updateShipment = async (orderId: number, data: Partial<Shipment>) => {
    const updated = await updateShipmentApi(orderId, data);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, shipment: updated } : o))
    );
    return updated;
  };

  const updatePayment = async (orderId: number, data: Partial<Payment>) => {
    const updated = await updatePaymentApi(orderId, data);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, payment: updated } : o))
    );
    return updated;
  };

  return {
    orders,
    isLoaded,
    error,
    refetch: load,
    addOrder,
    updateOrder,
    deleteOrder,
    getOrder,
    fetchOrder,
    updateShipment,
    updatePayment,
  };
}