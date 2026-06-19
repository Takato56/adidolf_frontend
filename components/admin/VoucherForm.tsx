'use client';

import { Voucher, DiscountType } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface VoucherFormProps {
  voucher?: Voucher;
  onSubmit: (data: Omit<Voucher, 'id'>) => void;
  isLoading?: boolean;
}

function toInputDate(iso: string): string {
  return iso.split('T')[0];
}

function nullOrValue(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? null : parsed;
}

export function VoucherForm({
  voucher,
  onSubmit,
  isLoading = false,
}: VoucherFormProps) {
  const router = useRouter();
  const isEditing = !!voucher;

  const [formData, setFormData] = useState({
    code: voucher?.code || '',
    discount_type: voucher?.discount_type || ('percent' as DiscountType),
    discount_value: voucher?.discount_value ?? '',
    max_discount: voucher?.max_discount ?? '',
    min_order_amount: voucher?.min_order_amount ?? '',
    usage_limit: voucher?.usage_limit ?? '',
    usage_count: voucher?.usage_count ?? 0,
    valid_from: voucher?.valid_from ? toInputDate(voucher.valid_from) : '',
    valid_to: voucher?.valid_to ? toInputDate(voucher.valid_to) : '',
    is_active: voucher?.is_active ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Voucher code is required';
    } else if (!/^[A-Z0-9_-]+$/.test(formData.code.trim())) {
      newErrors.code = 'Use only uppercase letters, numbers, hyphens, or underscores';
    }

    if (formData.discount_value === '' || Number(formData.discount_value) <= 0) {
      newErrors.discount_value = 'Discount value must be greater than 0';
    }

    if (formData.discount_type === 'percent' && Number(formData.discount_value) > 100) {
      newErrors.discount_value = 'Percent discount cannot exceed 100%';
    }

    if (formData.max_discount !== '' && Number(formData.max_discount) <= 0) {
      newErrors.max_discount = 'Max discount must be positive';
    }

    if (formData.min_order_amount !== '' && Number(formData.min_order_amount) <= 0) {
      newErrors.min_order_amount = 'Min order amount must be positive';
    }

    if (formData.usage_limit !== '' && Number(formData.usage_limit) <= 0) {
      newErrors.usage_limit = 'Usage limit must be positive';
    }

    if (!formData.valid_from.trim()) {
      newErrors.valid_from = 'Valid from date is required';
    }

    if (!formData.valid_to.trim()) {
      newErrors.valid_to = 'Valid to date is required';
    }

    if (formData.valid_from && formData.valid_to && formData.valid_from > formData.valid_to) {
      newErrors.valid_to = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data: Omit<Voucher, 'id'> = {
      code: formData.code.trim(),
      discount_type: formData.discount_type,
      discount_value: Number(formData.discount_value),
      max_discount: nullOrValue(String(formData.max_discount)),
      min_order_amount: nullOrValue(String(formData.min_order_amount)),
      usage_limit: formData.usage_limit === '' ? null : parseInt(String(formData.usage_limit)) || null,
      usage_count: Number(formData.usage_count),
      valid_from: new Date(formData.valid_from).toISOString(),
      valid_to: new Date(formData.valid_to).toISOString(),
      is_active: formData.is_active,
    };

    onSubmit(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
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

  const Field = ({
    label,
    name,
    type = 'text',
    placeholder = '',
    required = false,
  }: {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
  }) => (
    <div>
      <label className="block text-sm font-medium text-text-primary mb-2">
        {label}
        {required && ' *'}
      </label>
      <input
        type={type}
        name={name}
        value={(formData as any)[name]}
        onChange={handleChange}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
          errors[name] ? 'border-red-500' : 'border-border-input'
        }`}
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="text-red-600 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Voucher Code *
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={(e) => {
              const val = e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
              setFormData((prev) => ({ ...prev, code: val }));
              if (errors.code) {
                setErrors((prev) => {
                  const updated = { ...prev };
                  delete updated.code;
                  return updated;
                });
              }
            }}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition font-mono ${
              errors.code ? 'border-red-500' : 'border-border-input'
            }`}
            placeholder="e.g. SAVE10"
          />
          {errors.code && (
            <p className="text-red-600 text-sm mt-1">{errors.code}</p>
          )}
        </div>

        {/* Discount Type */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Discount Type *
          </label>
          <select
            name="discount_type"
            value={formData.discount_type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          >
            <option value="percent">Percentage (%)</option>
            <option value="fixed">Fixed Amount ($)</option>
          </select>
        </div>

        {/* Discount Value */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Discount Value *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
              {formData.discount_type === 'percent' ? '%' : '$'}
            </span>
            <input
              type="number"
              name="discount_value"
              value={formData.discount_value}
              onChange={handleChange}
              className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.discount_value ? 'border-red-500' : 'border-border-input'
              }`}
              placeholder="0"
              min="0"
              step="0.01"
            />
          </div>
          {errors.discount_value && (
            <p className="text-red-600 text-sm mt-1">
              {errors.discount_value}
            </p>
          )}
        </div>

        {/* Max Discount */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Max Discount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
              $
            </span>
            <input
              type="number"
              name="max_discount"
              value={formData.max_discount}
              onChange={handleChange}
              className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.max_discount ? 'border-red-500' : 'border-border-input'
              }`}
              placeholder="No limit"
              min="0"
              step="0.01"
            />
          </div>
          {errors.max_discount && (
            <p className="text-red-600 text-sm mt-1">
              {errors.max_discount}
            </p>
          )}
        </div>

        {/* Min Order Amount */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Min Order Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
              $
            </span>
            <input
              type="number"
              name="min_order_amount"
              value={formData.min_order_amount}
              onChange={handleChange}
              className={`w-full pl-8 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.min_order_amount
                  ? 'border-red-500'
                  : 'border-border-input'
              }`}
              placeholder="No minimum"
              min="0"
              step="0.01"
            />
          </div>
          {errors.min_order_amount && (
            <p className="text-red-600 text-sm mt-1">
              {errors.min_order_amount}
            </p>
          )}
        </div>

        {/* Usage Limit */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Usage Limit
          </label>
          <input
            type="number"
            name="usage_limit"
            value={formData.usage_limit}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.usage_limit ? 'border-red-500' : 'border-border-input'
            }`}
            placeholder="Unlimited"
            min="0"
          />
          {errors.usage_limit && (
            <p className="text-red-600 text-sm mt-1">{errors.usage_limit}</p>
          )}
        </div>

        {/* Usage Count (edit only) */}
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Usage Count
            </label>
            <input
              type="number"
              name="usage_count"
              value={formData.usage_count}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              min="0"
            />
          </div>
        )}

        {/* Valid From */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Valid From *
          </label>
          <input
            type="date"
            name="valid_from"
            value={formData.valid_from}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.valid_from ? 'border-red-500' : 'border-border-input'
            }`}
          />
          {errors.valid_from && (
            <p className="text-red-600 text-sm mt-1">{errors.valid_from}</p>
          )}
        </div>

        {/* Valid To */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Valid To *
          </label>
          <input
            type="date"
            name="valid_to"
            value={formData.valid_to}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.valid_to ? 'border-red-500' : 'border-border-input'
            }`}
          />
          {errors.valid_to && (
            <p className="text-red-600 text-sm mt-1">{errors.valid_to}</p>
          )}
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          id="is_active"
          className="w-4 h-4 text-blue-600 border-border-input rounded focus:ring-blue-500"
        />
        <label htmlFor="is_active" className="text-sm font-medium text-text-primary">
          Active (voucher can be applied by customers)
        </label>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? 'Saving...'
            : isEditing
            ? 'Update Voucher'
            : 'Create Voucher'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/vouchers')}
          className="px-6 py-2.5 bg-surface-secondary text-text-primary rounded-lg hover:bg-surface-dropdown transition font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
