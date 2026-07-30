// FILE: takato56-adidolf_frontend/components/admin/ProductForm.tsx

'use client';

import { Product, ProductVariant } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiPlus, FiTrash2, FiUpload, FiRefreshCw } from 'react-icons/fi';
import { useCategories } from '@/lib/hooks/useCategories';
import { uploadVariantImageApi } from '@/lib/products';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: Omit<Product, 'id'> & { imageFiles?: File[] }) => void;
  isLoading?: boolean;
}

function generateSmartSku(productName: string, color?: string, size?: string): string {
  const clean = (str: string) =>
    str.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);

  const base = productName ? clean(productName) : 'PROD';
  const c = color ? clean(color) : 'VAR';
  const s = size ? clean(size) : 'STD';

  return `${base}-${c}-${s}`;
}

function emptyVariant(productName = ''): ProductVariant {
  return {
    sku: generateSmartSku(productName),
    color: '',
    size: '',
    extra_price: 0,
    stock: 0,
    image_url: '',
  };
}

export function ProductForm({
  product,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const router = useRouter();
  const { categories, isLoaded: categoriesLoaded } = useCategories();
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: product?.name || '',
    categorySlug: product?.categorySlug || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    brand: product?.brand || '',
    isPublished: product?.isPublished ?? true,
    variants: product?.variants?.length ? product.variants : [emptyVariant()],
    images: product?.images?.length ? product.images : [''],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingVariantIndex, setUploadingVariantIndex] = useState<number | null>(null);

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
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price < 0) newErrors.price = 'Price must be positive';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.categorySlug.trim()) newErrors.categorySlug = 'Category is required';

    formData.variants.forEach((v, idx) => {
      if (!v.sku || !v.sku.trim()) {
        newErrors[`variant_${idx}_sku`] = 'SKU is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({ ...formData, imageFiles });
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
        ? parseFloat(value) || 0
        : value,
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || generateSlug(name),
    }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof ProductVariant,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      const cur = updated[index];

      const newColor = field === 'color' ? String(value) : cur.color;
      const newSize = field === 'size' ? String(value) : cur.size;

      // Auto-generate smart SKU if user hasn't manually overridden it with a custom format
      const isAutoSku = !cur.sku || cur.sku.includes('-VAR-') || cur.sku.startsWith('PROD-');
      const autoSku = isAutoSku
        ? generateSmartSku(prev.name, newColor, newSize)
        : cur.sku;

      updated[index] = {
        ...cur,
        [field]: field === 'extra_price' || field === 'stock' ? Number(value) || 0 : value,
        sku: field === 'sku' ? String(value) : autoSku,
      };

      return { ...prev, variants: updated };
    });
  };

  const regenerateSku = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.variants];
      const cur = updated[index];
      updated[index] = {
        ...cur,
        sku: generateSmartSku(prev.name, cur.color, cur.size),
      };
      return { ...prev, variants: updated };
    });
  };

  const handleVariantFileUpload = async (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!product?.id) {
      alert('Please save the product first before uploading variant images directly.');
      return;
    }

    setUploadingVariantIndex(index);
    try {
      const uploadedUrl = await uploadVariantImageApi(product.id, file);
      handleVariantChange(index, 'image_url', uploadedUrl);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload variant image');
    } finally {
      setUploadingVariantIndex(null);
      e.target.value = '';
    }
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, emptyVariant(prev.name)],
    }));
  };

  const removeVariant = (index: number) => {
    if (formData.variants.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    setImageFiles((prev) => [...prev, ...selected]);
    e.target.value = '';
  };

  const removeImageFile = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="categorySlug"
            value={formData.categorySlug}
            onChange={handleChange}
            disabled={!categoriesLoaded}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.categorySlug ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="" disabled>
              {categoriesLoaded ? 'Select a category' : 'Loading categories...'}
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="product-slug"
          />
        </div>

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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand *
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g., Adidolf"
          />
        </div>

        <div className="flex items-center pt-6">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Enter product description"
        />
      </div>

      {/* Variants Section with Auto-Generated SKU */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Product Variants *
          </label>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition cursor-pointer"
          >
            <FiPlus size={16} /> Add Variant
          </button>
        </div>

        <div className="space-y-4">
          {formData.variants.map((variant, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3"
            >
              <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-gray-600">
                      SKU (Auto-Generated) *
                    </label>
                    <button
                      type="button"
                      onClick={() => regenerateSku(index)}
                      className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                      title="Reset SKU"
                    >
                      <FiRefreshCw size={10} /> Auto
                    </button>
                  </div>
                  <input
                    type="text"
                    value={variant.sku || ''}
                    onChange={(e) =>
                      handleVariantChange(index, 'sku', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                    placeholder="SKU-AUTO"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Color</label>
                  <input
                    type="text"
                    value={variant.color || ''}
                    onChange={(e) =>
                      handleVariantChange(index, 'color', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="e.g. Black"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Size</label>
                  <input
                    type="text"
                    value={variant.size || ''}
                    onChange={(e) =>
                      handleVariantChange(index, 'size', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="e.g. M"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Extra Price ($)
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
                  <label className="block text-xs text-gray-600 mb-1">Stock</label>
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

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    disabled={formData.variants.length <= 1}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    title="Remove variant"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 items-center pt-1 border-t border-gray-200">
                <input
                  type="url"
                  value={variant.image_url || ''}
                  onChange={(e) =>
                    handleVariantChange(index, 'image_url', e.target.value)
                  }
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                  placeholder="Variant Image URL (or click Upload Image button ->)"
                />

                <label className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg cursor-pointer transition shrink-0">
                  <FiUpload size={14} />
                  {uploadingVariantIndex === index ? 'Uploading...' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleVariantFileUpload(index, e)}
                    className="hidden"
                    disabled={uploadingVariantIndex === index}
                  />
                </label>

                {variant.image_url && (
                  <img
                    src={variant.image_url}
                    alt="Variant thumbnail"
                    className="w-7 h-7 rounded border border-gray-300 object-cover shrink-0"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Main Product Images
          </label>
          <label className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition cursor-pointer">
            <FiPlus size={16} /> Choose Files
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {imageFiles.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {imageFiles.map((file, index) => (
              <div key={index} className="relative w-20 h-20 group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImageFile(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title="Remove"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <details className="mt-2">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
            Or paste image URLs directly
          </summary>
          <div className="space-y-3 mt-3">
            {formData.images.map((imageUrl, index) => (
              <div key={index} className="flex gap-3 items-center">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={formData.images.length <= 1}
                  className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition disabled:opacity-30 cursor-pointer"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition cursor-pointer"
            >
              <FiPlus size={16} /> Add URL
            </button>
          </div>
        </details>
      </div>

      <div className="flex gap-4 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer disabled:opacity-50"
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
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}