'use client';

import { Product, ProductVariant } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id'>) => void;
  isLoading?: boolean;
}

function emptyVariant(): ProductVariant {
  return { color: '', size: '', extra_price: 0, stock: 0, image_url: '' };
}

export function ProductForm({
  product,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: product?.name || '',
    categorySlug: product?.categorySlug || 'menswear',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    brand: product?.brand || '',
    isPublished: product?.isPublished ?? true,
    variants: product?.variants?.length
      ? product.variants
      : [emptyVariant()],
    images: product?.images?.length ? product.images : [''],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (formData.price < 0) newErrors.price = 'Price must be positive';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.categorySlug.trim())
      newErrors.categorySlug = 'Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    setFormData((prev) => ({
      ...prev,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
        : name === 'price'
        ? parseFloat(value)
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
    if (errors.name) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.name;
        return updated;
      });
    }
  };

  // Variant handlers
  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      updated[index] = {
        ...updated[index],
        [field]:
          field === 'extra_price' || field === 'stock' ? Number(value) : value,
      };
      return { ...prev, variants: updated };
    });
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, emptyVariant()],
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  // Image handlers
  const handleImageChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated[index] = value;
      return { ...prev, images: updated };
    });
  };

  const addImage = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImage = (index: number) => {
    if (formData.images.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
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
            onChange={handleNameChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter product name"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
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
            <p className="text-red-600 text-sm mt-1">
              {errors.categorySlug}
            </p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.slug ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="product-slug"
          />
          {errors.slug && (
            <p className="text-red-600 text-sm mt-1">{errors.slug}</p>
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

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand *
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.brand ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Nike"
          />
          {errors.brand && (
            <p className="text-red-600 text-sm mt-1">{errors.brand}</p>
          )}
        </div>

        {/* Published */}
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Published</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter product description"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Variants */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Variants *
          </label>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
          >
            <FiPlus size={16} /> Add Variant
          </button>
        </div>
        <div className="space-y-4">
          {formData.variants.map((variant, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-3 items-end p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={variant.color || ''}
                  onChange={(e) =>
                    handleVariantChange(index, 'color', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="e.g., Navy"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Size
                </label>
                <input
                  type="text"
                  value={variant.size || ''}
                  onChange={(e) =>
                    handleVariantChange(index, 'size', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="e.g., M"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Extra Price
                </label>
                <input
                  type="number"
                  value={variant.extra_price}
                  onChange={(e) =>
                    handleVariantChange(index, 'extra_price', e.target.value)
                  }
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) =>
                    handleVariantChange(index, 'stock', e.target.value)
                  }
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={variant.image_url || ''}
                  onChange={(e) =>
                    handleVariantChange(index, 'image_url', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  placeholder="https://..."
                />
              </div>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                disabled={formData.variants.length <= 1}
                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove variant"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Product Images *
          </label>
          <button
            type="button"
            onClick={addImage}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
          >
            <FiPlus size={16} /> Add Image
          </button>
        </div>
        <div className="space-y-3">
          {formData.images.map((imageUrl, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => handleImageChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                disabled={formData.images.length <= 1}
                className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                title="Remove image"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
        >
          {isLoading
            ? 'Saving...'
            : product
            ? 'Update Product'
            : 'Create Product'}
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
