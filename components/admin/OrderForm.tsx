'use client';

import { Order, OrderStatus } from '@/types';
import { useProducts } from '@/lib/hooks/useProducts';
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

interface OrderFormProps {
  order?: Order;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS: OrderStatus[] = [
  'pending',
  'confirmed',
  'shipping',
  'done',
  'cancelled',
];

export function OrderForm({
  order,
  onSubmit,
  isLoading = false,
}: OrderFormProps) {
  const router = useRouter();
  const { products, isLoaded: productsLoaded } = useProducts();

  // ---- Order header state (stored as strings for input, converted to numbers on submit) ----
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

  // ---- Items state ----
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

  // ---- Computed totals ----
  const computedSubtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );

  const computedTotal =
    computedSubtotal - formData.discountAmount + formData.shippingFee;

  // ---- Helpers ----
  const selectedProduct = (productId: string) =>
    products.find((p) => p.id === productId) || null;

  const productVariants = (productId: string) => {
    const p = selectedProduct(productId);
    return p?.variants || [];
  };

  // ---- Validation ----
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.userId.trim() || isNaN(Number(formData.userId)) || Number(formData.userId) <= 0)
      newErrors.userId = 'Valid User ID is required';
    if (!formData.addressId.trim() || isNaN(Number(formData.addressId)) || Number(formData.addressId) <= 0)
      newErrors.addressId = 'Valid Address ID is required';
    if (formData.discountAmount < 0)
      newErrors.discountAmount = 'Discount cannot be negative';
    if (formData.shippingFee < 0)
      newErrors.shippingFee = 'Shipping fee cannot be negative';
    if (!formData.createdAt) newErrors.createdAt = 'Date is required';

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.productId) {
        newErrors[`item_${i}_product`] = 'Product is required';
      }
      if (item.quantity < 1) {
        newErrors[`item_${i}_quantity`] = 'Quantity must be at least 1';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const itemsWithIds = items.map((item, idx) => ({
      ...item,
      productId: parseInt(item.productId) || 0,
      variantId: item.variantId ? (parseInt(item.variantId) || null) : null,
      id: order?.items?.[idx]?.id || 0,
      subtotal: item.unitPrice * item.quantity,
    }));

    const subtotal = itemsWithIds.reduce((sum, i) => sum + i.subtotal, 0);
    const totalPrice =
      subtotal - formData.discountAmount + formData.shippingFee;

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

  // ---- Header field change ----
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'discountAmount' || name === 'shippingFee'
          ? parseFloat(value) || 0
          : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // ---- Item handlers ----
  const handleItemProduct = (index: number, productId: string) => {
    setItems((prev) => {
      const updated = [...prev];
      const prod = products.find((p) => p.id === productId);
      const variant =
        prod && prod.variants.length === 1 ? prod.variants[0] : null;
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
    const key = `item_${index}_product`;
    if (errors[key]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const handleItemVariant = (index: number, variantId: string) => {
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
        unitPrice: prod
          ? prod.price + (variant?.extra_price || 0)
          : item.unitPrice,
      };
      return updated;
    });
  };

  const handleItemQuantity = (index: number, quantity: number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantity: Math.max(1, quantity) };
      return updated;
    });
    const key = `item_${index}_quantity`;
    if (errors[key]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const addItem = () => {
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
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  if (!productsLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-muted">Loading products...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ---- Order Header ---- */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Order Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              User ID *
            </label>
            <input
              type="number"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              min="1"
              step="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.userId ? 'border-red-500' : 'border-border-input'
              }`}
              placeholder="e.g. 1"
            />
            {errors.userId && (
              <p className="text-red-600 text-sm mt-1">{errors.userId}</p>
            )}
          </div>

          {/* Address ID */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Address ID *
            </label>
            <input
              type="number"
              name="addressId"
              value={formData.addressId}
              onChange={handleChange}
              min="1"
              step="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.addressId ? 'border-red-500' : 'border-border-input'
              }`}
              placeholder="e.g. 1"
            />
            {errors.addressId && (
              <p className="text-red-600 text-sm mt-1">{errors.addressId}</p>
            )}
          </div>

          {/* Voucher ID */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Voucher ID
            </label>
            <input
              type="number"
              name="voucherId"
              value={formData.voucherId}
              onChange={handleChange}
              min="0"
              step="1"
              className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. 0"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Discount Amount */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Discount Amount
            </label>
            <input
              type="number"
              name="discountAmount"
              value={formData.discountAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.discountAmount ? 'border-red-500' : 'border-border-input'
              }`}
            />
            {errors.discountAmount && (
              <p className="text-red-600 text-sm mt-1">
                {errors.discountAmount}
              </p>
            )}
          </div>

          {/* Shipping Fee */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Shipping Fee
            </label>
            <input
              type="number"
              name="shippingFee"
              value={formData.shippingFee}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.shippingFee ? 'border-red-500' : 'border-border-input'
              }`}
            />
            {errors.shippingFee && (
              <p className="text-red-600 text-sm mt-1">{errors.shippingFee}</p>
            )}
          </div>

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Creation Date *
            </label>
            <input
              type="datetime-local"
              name="createdAt"
              value={formData.createdAt}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.createdAt ? 'border-red-500' : 'border-border-input'
              }`}
            />
            {errors.createdAt && (
              <p className="text-red-600 text-sm mt-1">{errors.createdAt}</p>
            )}
          </div>

          {/* Note */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Note (optional)
            </label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
              placeholder="Any special instructions..."
            />
          </div>
        </div>
      </div>

      {/* ---- Order Items ---- */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Order Items ({items.length})
          </h3>
          <button
            type="button"
            onClick={addItem}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <FiPlus size={16} />
            Add Item
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-surface-secondary rounded-lg border border-border p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-text-primary">
                  Item #{index + 1}
                </span>
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Remove item"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Product dropdown */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    Product *
                  </label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemProduct(index, e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition ${
                      errors[`item_${index}_product`]
                        ? 'border-red-500'
                        : 'border-border-input'
                    }`}
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                  {errors[`item_${index}_product`] && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors[`item_${index}_product`]}
                    </p>
                  )}
                </div>

                {/* Variant dropdown */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    Variant
                  </label>
                  <select
                    value={item.variantId || ''}
                    onChange={(e) =>
                      handleItemVariant(index, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border-input rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                    disabled={!item.productId}
                  >
                    <option value="">Default</option>
                    {productVariants(item.productId).map((v) => (
                      <option key={v.id} value={v.id}>
                        {[v.color, v.size].filter(Boolean).join(' / ') ||
                          'Variant'}{' '}
                        {v.extra_price > 0 &&
                          `(+$${v.extra_price.toFixed(2)})`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemQuantity(index, parseInt(e.target.value) || 1)
                    }
                    min="1"
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition ${
                      errors[`item_${index}_quantity`]
                        ? 'border-red-500'
                        : 'border-border-input'
                    }`}
                  />
                  {errors[`item_${index}_quantity`] && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors[`item_${index}_quantity`]}
                    </p>
                  )}
                </div>

                {/* Unit Price & Subtotal */}
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">
                    Unit / Subtotal
                  </label>
                  <div className="text-sm text-text-primary bg-surface-elevated px-3 py-2 border border-border rounded-lg">
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

      {/* ---- Summary ---- */}
      <div className="bg-surface-secondary rounded-lg border border-border p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2 text-sm">
          <div className="space-y-1">
            <p className="text-text-muted">
              Subtotal:{' '}
              <span className="font-medium text-text-primary">
                ${computedSubtotal.toFixed(2)}
              </span>
            </p>
            <p className="text-text-muted">
              Discount:{' '}
              <span className="font-medium text-red-600">
                -${formData.discountAmount.toFixed(2)}
              </span>
            </p>
            <p className="text-text-muted">
              Shipping:{' '}
              <span className="font-medium text-text-primary">
                ${formData.shippingFee.toFixed(2)}
              </span>
            </p>
          </div>
          <div className="flex items-end">
            <p className="text-lg font-bold text-text-primary">
              Total: ${computedTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* ---- Actions ---- */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : order ? 'Update Order' : 'Create Order'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/orders')}
          className="px-6 py-3 bg-surface-elevated border border-border-input text-text-primary rounded-lg hover:bg-surface-secondary transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}