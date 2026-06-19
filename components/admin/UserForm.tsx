'use client';

import { User, UserRole, Address } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

interface UserFormProps {
  user?: User;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function UserForm({
  user,
  onSubmit,
  isLoading = false,
}: UserFormProps) {
  const router = useRouter();
  const isEditing = !!user;

  const [formData, setFormData] = useState({
    email: user?.email || '',
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    avatar_url: user?.avatar_url || '',
    password: '',
    role: user?.role || ('customer' as UserRole),
    is_active: user?.is_active ?? 1,
    created_at: user?.created_at || new Date().toISOString(),
    password_hash: user?.password_hash || '',
  });

  const [addresses, setAddresses] = useState<Partial<Address>[]>(() => {
    if (user?.addresses?.length) {
      return user.addresses.map((a) => ({ ...a }));
    }
    return [];
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!isEditing && !formData.password.trim()) {
      newErrors.password = 'Password is required for new users';
    }
    if (!formData.created_at.trim()) newErrors.created_at = 'Creation date is required';

    // Validate addresses
    for (let i = 0; i < addresses.length; i++) {
      const addr = addresses[i];
      if (!addr.recipient_name?.trim()) {
        newErrors[`addr_${i}_recipient_name`] = 'Recipient name is required';
      }
      if (!addr.phone?.trim()) {
        newErrors[`addr_${i}_phone`] = 'Phone is required';
      }
      if (!addr.province?.trim()) {
        newErrors[`addr_${i}_province`] = 'Province is required';
      }
      if (!addr.district?.trim()) {
        newErrors[`addr_${i}_district`] = 'District is required';
      }
      if (!addr.ward?.trim()) {
        newErrors[`addr_${i}_ward`] = 'Ward is required';
      }
      if (!addr.street_detail?.trim()) {
        newErrors[`addr_${i}_street_detail`] = 'Street detail is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data: any = {
      ...formData,
      password_hash: isEditing
        ? user.password_hash
        : formData.password, // In production this would be hashed server-side
      addresses: addresses.map((a) => ({
        ...a,
        is_default: a.is_default ?? 0,
      })),
    };
    delete data.password;
    onSubmit(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === 'checkbox'
        ? (e.target as HTMLInputElement).checked ? 1 : 0
        : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleAddressChange = (
    index: number,
    field: keyof Address,
    value: string | number
  ) => {
    setAddresses((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
    const key = `addr_${index}_${field}`;
    if (errors[key]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    }
  };

  const handleAddressDefault = (index: number) => {
    setAddresses((prev) =>
      prev.map((a, i) => ({
        ...a,
        is_default: i === index ? 1 : 0,
      }))
    );
  };

  const addAddress = () => {
    setAddresses((prev) => [
      ...prev,
      {
        id: 0,
        recipient_name: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        street_detail: '',
        is_default: prev.length === 0 ? 1 : 0,
      },
    ]);
  };

  const removeAddress = (index: number) => {
    setAddresses((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (prev[index].is_default && updated.length > 0) {
        updated[0] = { ...updated[0], is_default: 1 };
      }
      return updated;
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* ---- User Details ---- */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          User Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.email ? 'border-red-500' : 'border-border-input'
              }`}
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.full_name ? 'border-red-500' : 'border-border-input'
              }`}
              placeholder="John Doe"
            />
            {errors.full_name && (
              <p className="text-red-600 text-sm mt-1">{errors.full_name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Phone *
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.phone ? 'border-red-500' : 'border-border-input'
              }`}
              placeholder="+84 123 456 789"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Avatar URL
            </label>
            <input
              type="url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Password (only on create) */}
          {!isEditing && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                  errors.password ? 'border-red-500' : 'border-border-input'
                }`}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Role *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Active Status */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Status
            </label>
            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active === 1}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked ? 1 : 0,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 border-border-input rounded focus:ring-blue-500"
                />
                <span className="text-sm text-text-primary">Active</span>
              </label>
            </div>
          </div>

          {/* Created At */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Creation Date *
            </label>
            <input
              type="datetime-local"
              name="created_at"
              value={formData.created_at.slice(0, 16)}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                errors.created_at ? 'border-red-500' : 'border-border-input'
              }`}
            />
            {errors.created_at && (
              <p className="text-red-600 text-sm mt-1">{errors.created_at}</p>
            )}
          </div>
        </div>
      </div>

      {/* ---- Addresses ---- */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Addresses ({addresses.length})
          </h3>
          <button
            type="button"
            onClick={addAddress}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <FiPlus size={16} />
            Add Address
          </button>
        </div>

        {addresses.map((addr, index) => (
          <div
            key={index}
            className="border border-border rounded-lg p-4 mb-4 bg-gray-50"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-text-primary">
                Address #{index + 1}
                {addr.is_default === 1 && (
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                    Default
                  </span>
                )}
              </h4>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs text-text-muted cursor-pointer">
                  <input
                    type="radio"
                    name="default_address"
                    checked={addr.is_default === 1}
                    onChange={() => handleAddressDefault(index)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  Set as default
                </label>
                <button
                  type="button"
                  onClick={() => removeAddress(index)}
                  className="p-1 text-red-500 hover:bg-red-100 rounded transition"
                  title="Remove address"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Recipient Name */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  value={addr.recipient_name || ''}
                  onChange={(e) =>
                    handleAddressChange(index, 'recipient_name', e.target.value)
                  }
                  className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors[`addr_${index}_recipient_name`]
                      ? 'border-red-500'
                      : 'border-border-input'
                  }`}
                  placeholder="John Doe"
                />
                {errors[`addr_${index}_recipient_name`] && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors[`addr_${index}_recipient_name`]}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Phone *
                </label>
                <input
                  type="text"
                  value={addr.phone || ''}
                  onChange={(e) =>
                    handleAddressChange(index, 'phone', e.target.value)
                  }
                  className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors[`addr_${index}_phone`]
                      ? 'border-red-500'
                      : 'border-border-input'
                  }`}
                  placeholder="+84 123 456 789"
                />
                {errors[`addr_${index}_phone`] && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors[`addr_${index}_phone`]}
                  </p>
                )}
              </div>

              {/* Province */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Province *
                </label>
                <input
                  type="text"
                  value={addr.province || ''}
                  onChange={(e) =>
                    handleAddressChange(index, 'province', e.target.value)
                  }
                  className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors[`addr_${index}_province`]
                      ? 'border-red-500'
                      : 'border-border-input'
                  }`}
                  placeholder="Hồ Chí Minh"
                />
                {errors[`addr_${index}_province`] && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors[`addr_${index}_province`]}
                  </p>
                )}
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  District *
                </label>
                <input
                  type="text"
                  value={addr.district || ''}
                  onChange={(e) =>
                    handleAddressChange(index, 'district', e.target.value)
                  }
                  className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors[`addr_${index}_district`]
                      ? 'border-red-500'
                      : 'border-border-input'
                  }`}
                  placeholder="Quận 1"
                />
                {errors[`addr_${index}_district`] && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors[`addr_${index}_district`]}
                  </p>
                )}
              </div>

              {/* Ward */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Ward *
                </label>
                <input
                  type="text"
                  value={addr.ward || ''}
                  onChange={(e) =>
                    handleAddressChange(index, 'ward', e.target.value)
                  }
                  className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors[`addr_${index}_ward`]
                      ? 'border-red-500'
                      : 'border-border-input'
                  }`}
                  placeholder="Bến Nghé"
                />
                {errors[`addr_${index}_ward`] && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors[`addr_${index}_ward`]}
                  </p>
                )}
              </div>

              {/* Street Detail */}
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  Street Detail *
                </label>
                <input
                  type="text"
                  value={addr.street_detail || ''}
                  onChange={(e) =>
                    handleAddressChange(index, 'street_detail', e.target.value)
                  }
                  className={`w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
                    errors[`addr_${index}_street_detail`]
                      ? 'border-red-500'
                      : 'border-border-input'
                  }`}
                  placeholder="123 Nguyễn Huệ"
                />
                {errors[`addr_${index}_street_detail`] && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors[`addr_${index}_street_detail`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Form Actions ---- */}
      <div className="flex gap-4 pt-6 border-t border-border">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading
            ? 'Saving...'
            : isEditing
            ? 'Update User'
            : 'Create User'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-surface-secondary text-text-primary rounded-lg hover:bg-surface-dropdown transition font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}