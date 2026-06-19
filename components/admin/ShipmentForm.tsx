'use client';

import { Shipment, ShipmentStatus } from '@/types';
import { useState } from 'react';

interface ShipmentFormProps {
  shipment?: Shipment;
  orderId: number;
  onSubmit: (data: Partial<Shipment>) => void;
  onSuccess?: () => void;
}

const STATUS_OPTIONS: { value: ShipmentStatus; label: string }[] = [
  { value: 'preparing', label: 'Preparing' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'returned', label: 'Returned' },
];

export function ShipmentForm({
  shipment,
  orderId,
  onSubmit,
  onSuccess,
}: ShipmentFormProps) {
  const [formData, setFormData] = useState({
    carrier: shipment?.carrier || '',
    trackingNumber: shipment?.trackingNumber || '',
    status: shipment?.status || ('preparing' as ShipmentStatus),
    shippedAt: shipment?.shippedAt
      ? new Date(shipment.shippedAt).toISOString().slice(0, 16)
      : '',
    estimatedDelivery: shipment?.estimatedDelivery
      ? shipment.estimatedDelivery.split('T')[0]
      : '',
    deliveredAt: shipment?.deliveredAt
      ? new Date(shipment.deliveredAt).toISOString().slice(0, 16)
      : '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.carrier.trim()) newErrors.carrier = 'Carrier is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data: Partial<Shipment> = {
      shipmentId: shipment?.shipmentId || 0,
      carrier: formData.carrier.trim(),
      trackingNumber: formData.trackingNumber.trim() || null,
      status: formData.status,
      shippedAt: formData.shippedAt
        ? new Date(formData.shippedAt).toISOString()
        : null,
      estimatedDelivery: formData.estimatedDelivery || null,
      deliveredAt: formData.deliveredAt
        ? new Date(formData.deliveredAt).toISOString()
        : null,
    };

    onSubmit(data);
    setSaved(true);
    onSuccess?.();
  };

  const hasShipment = shipment && shipment.carrier;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          Shipment Information
        </h3>
        <p className="text-sm text-text-muted">
          {hasShipment
            ? `Shipment #${shipment.shipmentId} — ${shipment.carrier}`
            : 'No shipment assigned yet. Fill in the details below.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Carrier */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Carrier *
          </label>
          <input
            type="text"
            name="carrier"
            value={formData.carrier}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.carrier ? 'border-red-500' : 'border-border-input'
            }`}
            placeholder="e.g. FedEx, UPS, DHL"
          />
          {errors.carrier && (
            <p className="text-red-600 text-sm mt-1">{errors.carrier}</p>
          )}
        </div>

        {/* Tracking Number */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Tracking Number
          </label>
          <input
            type="text"
            name="trackingNumber"
            value={formData.trackingNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="e.g. 1Z-999-888"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Shipped At */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Shipped At
          </label>
          <input
            type="datetime-local"
            name="shippedAt"
            value={formData.shippedAt}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Estimated Delivery */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Estimated Delivery
          </label>
          <input
            type="date"
            name="estimatedDelivery"
            value={formData.estimatedDelivery}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Delivered At */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Delivered At
          </label>
          <input
            type="datetime-local"
            name="deliveredAt"
            value={formData.deliveredAt}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4 border-t border-border">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {hasShipment ? 'Update Shipment' : 'Save Shipment'}
        </button>
        {saved && (
          <span className="flex items-center text-sm text-green-600 font-medium">
            ✓ Saved
          </span>
        )}
      </div>
    </form>
  );
}