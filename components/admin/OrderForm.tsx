// FILE: takato56-adidolf_frontend/components/admin/OrderForm.tsx

'use client';

import { Order, OrderStatus } from '@/types';
import { useProducts } from '@/lib/hooks/useProducts';
import { useUsers } from '@/lib/hooks/useUsers';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { FiPlus, FiTrash2, FiLock, FiAlertTriangle } from 'react-icons/fi';

interface OrderFormProps {
  order?: Order;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipping',
  'delivered',
  'cancelled',
];

export function OrderForm({
  order,
  onSubmit,
  isLoading = false,
}: OrderFormProps) {
  const router = useRouter();
  const { products, isLoaded: productsLoaded } = useProducts();
  const { users, isLoaded: usersLoaded } = useUsers();

  const isCancelled = order?.status === 'cancelled';

  const [formData, setFormData] = useState({
    userId: order?.userId ? String(order.userId) : '',
    addressId: order?.addressId ? String(order.addressId) : '',
    voucherId: order?.voucherId ? String(order.voucherId) : '',
    status: order?.status || ('pending' as OrderStatus),
    discountAmount: order?.discountAmount ?? 0,
    shippingFee: order?.shippingFee ?? 0,
    note: order?.note || '',
    createdAt: order?.createdAt
      ? new Date(order.createdAt).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
  });

  const [items, setItems] = useState<
    {
      productId: string;
      variantId: string | null;
      productName: string;
      variantInfo: string | null;
      unitPrice: number;
      quantity: number;
    }[]
  >(() => {
    if (order?.items?.length) {
      return order.items.map((it) => ({
        productId: String(it.productId),
        variantId: it.variantId !== null ? String(it.variantId) : null,
        productName: it.productName,
        variantInfo: it.variantInfo,
        unitPrice: it.unitPrice,
        quantity: it.quantity,
      }));
    }
    return [
      {
        productId: '',
        variantId: null,
        productName: '',
        variantInfo: null,
        unitPrice: 0,
        quantity: 1,
      },
    ];
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const computedSubtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );

  const computedTotal =
    computedSubtotal - formData.discountAmount + formData.shippingFee;

  const selectedProduct = (productId: string) =>
    products.find((p) => p.id === productId) || null;

  const productVariants = (productId: string) => {
    const p = selectedProduct(productId);
    return p?.variants || [];
  };

  const selectedUser = useMemo(
    () => users.find((u) => String(u.id) === formData.userId),
    [users, formData.userId]
  );

  const validateForm = () => {
    if (isCancelled) return false;

    const newErrors: Record<string, string> = {};
    if (!formData.userId.trim()) newErrors.userId = 'Please select a registered customer';
    if (!formData.addressId.trim()) newErrors.addressId = 'Valid address ID is required';
    if (formData.discountAmount < 0) newErrors.discountAmount = 'Discount cannot be negative';
    if (formData.shippingFee < 0) newErrors.shippingFee = 'Shipping fee cannot be negative';

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.productId) newErrors[`item_${i}_product`] = 'Product is required';
      if (item.quantity < 1) newErrors[`item_${i}_quantity`] = 'Quantity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCancelled || !validateForm()) return;

    const itemsWithIds = items.map((item, idx) => ({
      ...item,
      productId: parseInt(item.productId) || 0,
      variantId: item.variantId ? parseInt(item.variantId) || null : null,
      id: order?.items?.[idx]?.id || 0,
      subtotal: item.unitPrice * item.quantity,
    }));

    const subtotal = itemsWithIds.reduce((sum, i) => sum + i.subtotal, 0);
    const totalPrice = subtotal - formData.discountAmount + formData.shippingFee;

    onSubmit({
      ...formData,
      userId: parseInt(formData.userId) || 0,
      addressId: parseInt(formData.addressId) || 0,
      voucherId: parseInt(formData.voucherId) || 0,
      createdAt: new Date(formData.createdAt).toISOString(),
      items: itemsWithIds,
      subtotal,
      totalPrice,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (isCancelled) return;
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'discountAmount' || name === 'shippingFee'
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleUserSelect = (userIdStr: string) => {
    if (isCancelled) return;
    const foundUser = users.find((u) => String(u.id) === userIdStr);
    const defaultAddrId = foundUser?.addresses?.find((a) => a.is_default === 1)?.id || foundUser?.addresses?.[0]?.id || 1;

    setFormData((prev) => ({
      ...prev,
      userId: userIdStr,
      addressId: String(defaultAddrId),
    }));
  };

  const handleItemProduct = (index: number, productId: string) => {
    if (isCancelled) return;
    setItems((prev) => {
      const updated = [...prev];
      const prod = products.find((p) => p.id === productId);
      const variant = prod && prod.variants.length === 1 ? prod.variants[0] : null;
      updated[index] = {
        ...updated[index],
        productId,
        variantId: variant?.id || null,
        productName: prod?.name || '',
        variantInfo: variant
          ? [variant.color, variant.size].filter(Boolean).join(' / ') || null
          : null,
        unitPrice: prod ? prod.price + (variant?.extra_price || 0) : 0,
        quantity: 1,
      };
      return updated;
    });
  };

  const handleItemVariant = (index: number, variantId: string) => {
    if (isCancelled) return;
    setItems((prev) => {
      const updated = [...prev];
      const item = updated[index];
      const prod = selectedProduct(item.productId);
      const variant = prod?.variants.find((v) => v.id === variantId) || null;
      updated[index] = {
        ...item,
        variantId: variantId || null,
        variantInfo: variant
          ? [variant.color, variant.size].filter(Boolean).join(' / ') || null
          : null,
        unitPrice: prod ? prod.price + (variant?.extra_price || 0) : item.unitPrice,
      };
      return updated;
    });
  };

  const handleItemQuantity = (index: number, quantity: number) => {
    if (isCancelled) return;
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: Math.max(1, quantity) };
      return updated;
    });
  };

  const addItem = () => {
    if (isCancelled) return;
    setItems((prev) => [
      ...prev,
      {
        productId: '',
        variantId: null,
        productName: '',
        variantInfo: null,
        unitPrice: 0,
        quantity: 1,
      },
    ]);
  };

  const removeItem = (index: number) => {
    if (isCancelled || items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  if (!productsLoaded || !usersLoaded) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        Loading form resources...
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Cancelled Order Banner */}
      {isCancelled && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center gap-3 text-red-800">
          <FiLock size={20} className="shrink-0" />
          <div>
            <p className="font-bold text-sm">Order Cancelled (Read-Only)</p>
            <p className="text-xs text-red-600">
              This order has been cancelled and its inventory released. It is locked from further modifications.
            </p>
          </div>
        </div>
      )}

      {/* Order Header / Metadata */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Information
        </h3>

        {/* Read-Only Metadata Badges for Existing Orders */}
        {order && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div>
              <p className="text-xs text-gray-500 font-medium">Order ID</p>
              <p className="text-sm font-bold text-gray-900">#{order.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Customer ID</p>
              <p className="text-sm font-bold text-gray-900">User #{order.userId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Address Reference</p>
              <p className="text-sm font-bold text-gray-900">Address #{order.addressId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Voucher Applied</p>
              <p className="text-sm font-bold text-gray-900">
                {order.voucherId ? `Voucher #${order.voucherId}` : 'None'}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Customer Selection (Only for New Orders) */}
          {!order && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer *
              </label>
              <select
                value={formData.userId}
                onChange={(e) => handleUserSelect(e.target.value)}
                disabled={isCancelled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">Select customer account...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.full_name} ({u.email})
                  </option>
                ))}
              </select>
              {errors.userId && (
                <p className="text-red-600 text-xs mt-1">{errors.userId}</p>
              )}
            </div>
          )}

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isCancelled}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none uppercase font-semibold text-xs disabled:bg-gray-100"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Discount Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Amount ($)
            </label>
            <input
              type="number"
              name="discountAmount"
              value={formData.discountAmount}
              onChange={handleChange}
              disabled={isCancelled}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none disabled:bg-gray-100"
            />
          </div>

          {/* Shipping Fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping Fee ($)
            </label>
            <input
              type="number"
              name="shippingFee"
              value={formData.shippingFee}
              onChange={handleChange}
              disabled={isCancelled}
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none disabled:bg-gray-100"
            />
          </div>

          {/* Note */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Note
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              disabled={isCancelled}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none resize-none disabled:bg-gray-100"
              placeholder="Special instructions..."
            />
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Order Items ({items.length})
          </h3>
          {!isCancelled && (
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm cursor-pointer"
            >
              <FiPlus size={16} />
              Add Item
            </button>
          )}
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Item #{index + 1}
                </span>
                {!isCancelled && items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition cursor-pointer"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Product *
                  </label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemProduct(index, e.target.value)}
                    disabled={isCancelled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none disabled:bg-gray-100"
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Variant
                  </label>
                  <select
                    value={item.variantId || ''}
                    onChange={(e) => handleItemVariant(index, e.target.value)}
                    disabled={isCancelled || !item.productId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none disabled:bg-gray-100"
                  >
                    <option value="">Default</option>
                    {productVariants(item.productId).map((v) => (
                      <option key={v.id} value={v.id}>
                        {[v.color, v.size].filter(Boolean).join(' / ') || 'Variant'}{' '}
                        {v.extra_price > 0 && `(+$${v.extra_price.toFixed(2)})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemQuantity(index, parseInt(e.target.value) || 1)}
                    disabled={isCancelled}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Unit / Subtotal
                  </label>
                  <div className="text-sm text-gray-900 bg-white px-3 py-2 border border-gray-200 rounded-lg">
                    ${item.unitPrice.toFixed(2)} × {item.quantity} ={' '}
                    <span className="font-semibold">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Box */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm">
          <div className="space-y-1">
            <p className="text-gray-600">Subtotal: <span className="font-medium text-gray-900">${computedSubtotal.toFixed(2)}</span></p>
            <p className="text-gray-600">Discount: <span className="font-medium text-red-600">-${formData.discountAmount.toFixed(2)}</span></p>
            <p className="text-gray-600">Shipping: <span className="font-medium text-gray-900">${formData.shippingFee.toFixed(2)}</span></p>
          </div>
          <div className="flex items-end">
            <p className="text-lg font-bold text-gray-900">Total: ${computedTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        {!isCancelled ? (
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Saving...' : order ? 'Update Order' : 'Create Order'}
          </button>
        ) : (
          <p className="text-sm text-gray-500 italic py-2">
            Order modifications are disabled for cancelled orders.
          </p>
        )}
        <button
          type="button"
          onClick={() => router.push('/admin/orders')}
          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium cursor-pointer"
        >
          Back to Orders
        </button>
      </div>
    </form>
  );
}