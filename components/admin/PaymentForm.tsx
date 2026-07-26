'use client';

import { Payment, PaymentMethod, PaymentStatus } from '@/types';
import { useState } from 'react';

interface PaymentFormProps {
  payment?: Payment;
  orderId: number;
  onSubmit: (data: Partial<Payment>) => void;
  onSuccess?: () => void;
}

const METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'COD', label: 'COD' },
  { value: 'VNPay', label: 'VNPay' },
  { value: 'Momo', label: 'Momo' },
  { value: 'ZaloPay', label: 'ZaloPay' },
  { value: 'card', label: 'Card' },
];

const STATUS_OPTIONS: { value: PaymentStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
];

export function PaymentForm({
  payment,
  orderId,
  onSubmit,
  onSuccess,
}: PaymentFormProps) {
  const [formData, setFormData] = useState({
    method: payment?.method || ('COD' as PaymentMethod),
    status: payment?.status || ('pending' as PaymentStatus),
    amount: payment?.amount?.toString() || '',
    transactionId: payment?.transactionId || '',
    gatewayResponse: payment?.gatewayResponse || '',
    paidAt: payment?.paidAt
      ? new Date(payment.paidAt).toISOString().slice(0, 16)
      : '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.amount.trim() || isNaN(Number(formData.amount)) || Number(formData.amount) < 0)
      newErrors.amount = 'Valid amount is required';
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

    const data: Partial<Payment> = {
      paymentId: payment?.paymentId || 0,
      method: formData.method,
      status: formData.status,
      amount: parseFloat(formData.amount) || 0,
      transactionId: formData.transactionId.trim() || null,
      gatewayResponse: formData.gatewayResponse.trim() || null,
      paidAt: formData.paidAt
        ? new Date(formData.paidAt).toISOString()
        : null,
    };

    onSubmit(data);
    setSaved(true);
    onSuccess?.();
  };

  const hasPayment = payment && payment.paymentId > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Payment Information
        </h3>
        <p className="text-sm text-gray-500">
          {hasPayment
            ? `Payment #${payment.paymentId} — ${payment.method}`
            : 'No payment assigned yet. Fill in the details below.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Method *
          </label>
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            {METHOD_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.amount ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
          )}
        </div>

        {/* Transaction ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction ID
          </label>
          <input
            type="text"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="e.g. TXN-98765"
          />
        </div>

        {/* Paid At */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paid At
          </label>
          <input
            type="datetime-local"
            name="paidAt"
            value={formData.paidAt}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>
      </div>

      {/* Gateway Response */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gateway Response
        </label>
        <textarea
          name="gatewayResponse"
          value={formData.gatewayResponse}
          onChange={handleChange}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
          placeholder="e.g. Approved, Declined, etc."
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {hasPayment ? 'Update Payment' : 'Save Payment'}
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