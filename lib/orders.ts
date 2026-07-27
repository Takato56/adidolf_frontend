// FILE: takato56-adidolf_frontend/lib/orders.ts

import { fetchWithAuth } from '@/lib/auth';
import {
  Order,
  OrderItem,
  Shipment,
  Payment,
  OrderStatus,
  ShipmentStatus,
  PaymentStatus,
  PaymentMethod,
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiOrder {
  order_id: number;
  user_id: number;
  address_id: number;
  voucher_id: number | null;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  shipping_fee: number;
  total_price: number;
  note: string | null;
  created_at: string;
  updated_at?: string;
  items?: ApiOrderItem[];
  shipment?: ApiShipment;
  payment?: ApiPayment;
}

export interface ApiOrderItem {
  item_id: number;
  order_id: number;
  product_id: number;
  variant_id: number | null;
  product_name: string;
  variant_info: string | null;
  unit_price: number;
  quantity: number;
  subtotal: number;
}

export interface ApiShipment {
  shipment_id: number;
  order_id: number;
  carrier: string;
  tracking_number: string | null;
  status: ShipmentStatus;
  shipped_at: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
}

export interface ApiPayment {
  payment_id: number;
  order_id: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transaction_id: string | null;
  gateway_response: string | null;
  paid_at: string | null;
}

export interface CreateOrderFromCartDto {
  address_id: number;
  payment_method: PaymentMethod;
  voucher_code?: string;
  note?: string;
}

interface ApiEnvelope<T> {
  status: string;
  data: T;
}

async function unwrap<T>(res: Response, fallbackMessage: string): Promise<T> {
  if (!res.ok) {
    let message = fallbackMessage;
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // ignore
    }
    throw new Error(`${message} (${res.status})`);
  }
  const json: ApiEnvelope<T> = await res.json();
  return json.data;
}

function toFrontendItem(i: ApiOrderItem): OrderItem {
  return {
    id: i.item_id,
    productId: i.product_id,
    variantId: i.variant_id,
    productName: i.product_name,
    variantInfo: i.variant_info,
    unitPrice: Number(i.unit_price) || 0,
    quantity: i.quantity,
    subtotal: Number(i.subtotal) || 0,
  };
}

function toFrontendShipment(s: ApiShipment): Shipment {
  return {
    shipmentId: s.shipment_id,
    carrier: s.carrier,
    trackingNumber: s.tracking_number,
    status: s.status,
    shippedAt: s.shipped_at,
    estimatedDelivery: s.estimated_delivery,
    deliveredAt: s.delivered_at,
  };
}

function toFrontendPayment(p: ApiPayment): Payment {
  return {
    paymentId: p.payment_id,
    method: p.method,
    status: p.status,
    amount: Number(p.amount) || 0,
    transactionId: p.transaction_id,
    gatewayResponse: p.gateway_response,
    paidAt: p.paid_at,
  };
}

function toFrontendOrder(
  o: ApiOrder,
  items: OrderItem[] = [],
  shipment?: Shipment,
  payment?: Payment
): Order {
  const parsedItems =
    items.length > 0
      ? items
      : Array.isArray(o.items)
      ? o.items.map(toFrontendItem)
      : [];

  const parsedShipment = shipment || (o.shipment ? toFrontendShipment(o.shipment) : undefined);
  const parsedPayment = payment || (o.payment ? toFrontendPayment(o.payment) : undefined);

  return {
    id: o.order_id,
    userId: o.user_id,
    addressId: o.address_id,
    voucherId: o.voucher_id ?? 0,
    status: o.status,
    subtotal: Number(o.subtotal) || 0,
    discountAmount: Number(o.discount_amount) || 0,
    shippingFee: Number(o.shipping_fee) || 0,
    totalPrice: Number(o.total_price) || 0,
    note: o.note ?? '',
    createdAt: o.created_at,
    items: parsedItems,
    shipment: parsedShipment,
    payment: parsedPayment,
  };
}

// ---------- Customer Order APIs ----------

export async function createOrderFromCartApi(
  dto: CreateOrderFromCartDto
): Promise<Order> {
  const res = await fetchWithAuth(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  const data = await unwrap<any>(res, 'Failed to place order');

  if (data.order_id) {
    return toFrontendOrder(data);
  }

  return data as Order;
}

export async function getMyOrdersApi(): Promise<Order[]> {
  const res = await fetchWithAuth(`${BASE_URL}/orders`);
  const data = await unwrap<ApiOrder[]>(res, 'Failed to fetch your orders');
  return (Array.isArray(data) ? data : []).map((o) => toFrontendOrder(o));
}

// ---------- Admin Reads ----------

export async function getOrdersApi(): Promise<Order[]> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/orders`);
  const data = await unwrap<ApiOrder[]>(res, 'Failed to fetch orders');
  return data.map((o) => toFrontendOrder(o));
}

async function getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/order-items?order_id=${orderId}`);
  const data = await unwrap<ApiOrderItem[]>(res, 'Failed to fetch order items');
  return data.map(toFrontendItem);
}

async function getShipmentByOrderId(orderId: number): Promise<Shipment | undefined> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/shipments?order_id=${orderId}`);
  const data = await unwrap<ApiShipment[]>(res, 'Failed to fetch shipment');
  return data[0] ? toFrontendShipment(data[0]) : undefined;
}

async function getRawShipmentByOrderId(orderId: number): Promise<ApiShipment | undefined> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/shipments?order_id=${orderId}`);
  const data = await unwrap<ApiShipment[]>(res, 'Failed to fetch shipment');
  return data[0];
}

async function getPaymentByOrderId(orderId: number): Promise<Payment | undefined> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/payments?order_id=${orderId}`);
  const data = await unwrap<ApiPayment[]>(res, 'Failed to fetch payment');
  return data[0] ? toFrontendPayment(data[0]) : undefined;
}

async function getRawPaymentByOrderId(orderId: number): Promise<ApiPayment | undefined> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/payments?order_id=${orderId}`);
  const data = await unwrap<ApiPayment[]>(res, 'Failed to fetch payment');
  return data[0];
}

export async function getOrderByIdApi(id: number): Promise<Order> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/orders/${id}`);
  const orderData = await unwrap<ApiOrder>(res, 'Failed to fetch order');

  const [items, shipment, payment] = await Promise.all([
    getOrderItemsByOrderId(id),
    getShipmentByOrderId(id),
    getPaymentByOrderId(id),
  ]);

  return toFrontendOrder(orderData, items, shipment, payment);
}

// ---------- Admin Writes ----------

export async function createOrderApi(
  order: Omit<Order, 'id' | 'subtotal' | 'totalPrice'> & { items: Omit<OrderItem, 'id' | 'subtotal'>[] }
): Promise<Order> {
  const subtotal = order.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const totalPrice = subtotal - order.discountAmount + order.shippingFee;

  const res = await fetchWithAuth(`${BASE_URL}/admin/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: order.userId,
      address_id: order.addressId,
      voucher_id: order.voucherId || undefined,
      status: order.status,
      subtotal,
      discount_amount: order.discountAmount,
      shipping_fee: order.shippingFee,
      total_price: totalPrice,
      note: order.note || undefined,
    }),
  });
  const createdOrder = await unwrap<ApiOrder>(res, 'Failed to create order');

  const items = await Promise.all(
    order.items.map(async (item) => {
      const itemRes = await fetchWithAuth(`${BASE_URL}/admin/order-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: createdOrder.order_id,
          product_id: item.productId,
          variant_id: item.variantId || undefined,
          product_name: item.productName,
          variant_info: item.variantInfo || undefined,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          subtotal: item.unitPrice * item.quantity,
        }),
      });
      const created = await unwrap<ApiOrderItem>(itemRes, 'Failed to create order item');
      return toFrontendItem(created);
    })
  );

  return toFrontendOrder(createdOrder, items);
}

export async function updateOrderApi(
  id: number,
  updates: Partial<Order>
): Promise<Order> {
  let subtotal = updates.subtotal;
  let totalPrice = updates.totalPrice;

  if (updates.items) {
    subtotal = updates.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    totalPrice =
      subtotal - (updates.discountAmount ?? 0) + (updates.shippingFee ?? 0);
  }

  const res = await fetchWithAuth(`${BASE_URL}/admin/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(updates.userId !== undefined ? { user_id: updates.userId } : {}),
      ...(updates.addressId !== undefined ? { address_id: updates.addressId } : {}),
      ...(updates.voucherId !== undefined ? { voucher_id: updates.voucherId || null } : {}),
      ...(updates.status !== undefined ? { status: updates.status } : {}),
      ...(subtotal !== undefined ? { subtotal } : {}),
      ...(updates.discountAmount !== undefined ? { discount_amount: updates.discountAmount } : {}),
      ...(updates.shippingFee !== undefined ? { shipping_fee: updates.shippingFee } : {}),
      ...(totalPrice !== undefined ? { total_price: totalPrice } : {}),
      ...(updates.note !== undefined ? { note: updates.note || null } : {}),
    }),
  });
  const updatedOrder = await unwrap<ApiOrder>(res, 'Failed to update order');

  let items: OrderItem[];
  if (updates.items) {
    items = await syncOrderItems(id, updates.items);
  } else {
    items = await getOrderItemsByOrderId(id);
  }

  const [shipment, payment] = await Promise.all([
    getShipmentByOrderId(id),
    getPaymentByOrderId(id),
  ]);

  return toFrontendOrder(updatedOrder, items, shipment, payment);
}

async function syncOrderItems(
  orderId: number,
  desired: Partial<OrderItem>[]
): Promise<OrderItem[]> {
  const current = await getOrderItemsByOrderId(orderId);
  const currentIds = new Set(current.map((i) => i.id));

  const toUpdate = desired.filter((i) => i.id && currentIds.has(i.id));
  const toCreate = desired.filter((i) => !i.id || !currentIds.has(i.id));
  const desiredIds = new Set(toUpdate.map((i) => i.id));
  const toDelete = current.filter((i) => !desiredIds.has(i.id));

  await Promise.all(
    toDelete.map((i) =>
      fetchWithAuth(`${BASE_URL}/admin/order-items/${i.id}`, { method: 'DELETE' })
    )
  );

  await Promise.all(
    toUpdate.map((i) =>
      fetchWithAuth(`${BASE_URL}/admin/order-items/${i.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: i.productId,
          variant_id: i.variantId || undefined,
          product_name: i.productName,
          variant_info: i.variantInfo || undefined,
          unit_price: i.unitPrice,
          quantity: i.quantity,
          subtotal: (i.unitPrice ?? 0) * (i.quantity ?? 0),
        }),
      })
    )
  );

  await Promise.all(
    toCreate.map((i) =>
      fetchWithAuth(`${BASE_URL}/admin/order-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderId,
          product_id: i.productId,
          variant_id: i.variantId || undefined,
          product_name: i.productName,
          variant_info: i.variantInfo || undefined,
          unit_price: i.unitPrice,
          quantity: i.quantity,
          subtotal: (i.unitPrice ?? 0) * (i.quantity ?? 0),
        }),
      })
    )
  );

  return getOrderItemsByOrderId(orderId);
}

export async function updateShipmentApi(
  orderId: number,
  data: Partial<Shipment>
): Promise<Shipment> {
  const existing = await getRawShipmentByOrderId(orderId);

  const payload = {
    order_id: orderId,
    ...(data.carrier !== undefined ? { carrier: data.carrier } : {}),
    ...(data.trackingNumber !== undefined ? { tracking_number: data.trackingNumber } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
    ...(data.shippedAt !== undefined ? { shipped_at: data.shippedAt } : {}),
    ...(data.estimatedDelivery !== undefined
      ? { estimated_delivery: data.estimatedDelivery }
      : {}),
    ...(data.deliveredAt !== undefined ? { delivered_at: data.deliveredAt } : {}),
  };

  const res = existing
    ? await fetchWithAuth(`${BASE_URL}/admin/shipments/${existing.shipment_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    : await fetchWithAuth(`${BASE_URL}/admin/shipments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

  const saved = await unwrap<ApiShipment>(res, 'Failed to save shipment');
  return toFrontendShipment(saved);
}

export async function updatePaymentApi(
  orderId: number,
  data: Partial<Payment>
): Promise<Payment> {
  const existing = await getRawPaymentByOrderId(orderId);

  const payload = {
    order_id: orderId,
    ...(data.method !== undefined ? { method: data.method } : {}),
    ...(data.status !== undefined ? { status: data.status } : {}),
    ...(data.amount !== undefined ? { amount: data.amount } : {}),
    ...(data.transactionId !== undefined ? { transaction_id: data.transactionId } : {}),
    ...(data.gatewayResponse !== undefined ? { gateway_response: data.gatewayResponse } : {}),
    ...(data.paidAt !== undefined ? { paid_at: data.paidAt } : {}),
  };

  const res = existing
    ? await fetchWithAuth(`${BASE_URL}/admin/payments/${existing.payment_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    : await fetchWithAuth(`${BASE_URL}/admin/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

  const saved = await unwrap<ApiPayment>(res, 'Failed to save payment');
  return toFrontendPayment(saved);
}

export async function deleteOrderApi(id: number): Promise<void> {
  const [items, shipment, payment] = await Promise.all([
    getOrderItemsByOrderId(id),
    getRawShipmentByOrderId(id),
    getRawPaymentByOrderId(id),
  ]);

  await Promise.all(
    items.map((i) => fetchWithAuth(`${BASE_URL}/admin/order-items/${i.id}`, { method: 'DELETE' }))
  );
  if (shipment) {
    await fetchWithAuth(`${BASE_URL}/admin/shipments/${shipment.shipment_id}`, {
      method: 'DELETE',
    });
  }
  if (payment) {
    await fetchWithAuth(`${BASE_URL}/admin/payments/${payment.payment_id}`, {
      method: 'DELETE',
    });
  }

  const res = await fetchWithAuth(`${BASE_URL}/admin/orders/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    let message = 'Failed to delete order';
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // ignore
    }
    throw new Error(`${message} (${res.status})`);
  }
}