'use client';

import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => void;
  isLoading?: boolean;
}

export function ProductForm({
  product,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: product?.name || '',
    sku: product?.sku || '',
    categorySlug: product?.categorySlug || 'menswear',
    price: product?.price || 0,
    stock: product?.stock || 0,
    imageUrl: product?.imageUrl || '',
    attributes: product?.attributes || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.price < 0) newErrors.price = 'Price must be positive';
    if (formData.stock < 0) newErrors.stock = 'Stock must be non-negative';
    if (!formData.categorySlug.trim())
      newErrors.categorySlug = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'stock' ? parseFloat(value) : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* SKU */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SKU *
          </label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.sku ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., TS-001"
          />
          {errors.sku && (
            <p className="text-red-600 text-sm mt-1">{errors.sku}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="categorySlug"
            value={formData.categorySlug}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.categorySlug ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="menswear">Menswear</option>
            <option value="womenswear">Womenswear</option>
            <option value="accessories">Accessories</option>
            <option value="footwear">Footwear</option>
          </select>
          {errors.categorySlug && (
            <p className="text-red-600 text-sm mt-1">{errors.categorySlug}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (USD) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.price ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
          {errors.price && (
            <p className="text-red-600 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock (Units) *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.stock ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0"
          />
          {errors.stock && (
            <p className="text-red-600 text-sm mt-1">{errors.stock}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      {/* Attributes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attributes
        </label>
        <textarea
          name="attributes"
          value={formData.attributes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="e.g., Size: L / Color: Navy / Material: Cotton"
        />
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
