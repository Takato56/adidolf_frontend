'use client';

import { Category } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Omit<Category, 'id'>) => void;
  isLoading?: boolean;
}

export function CategoryForm({
  category,
  onSubmit,
  isLoading = false,
}: CategoryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<Category, 'id'>>({
    name: category?.name || '',
    slug: category?.slug || '',
    imageUrl: category?.imageUrl || '',
    description: category?.description || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Category name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData((prev) => ({ ...prev, slug }));
    if (errors.slug) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated.slug;
        return updated;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category Name */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Category Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-surface-input text-text-primary ${
            errors.name ? 'border-red-500' : 'border-border-input'
          }`}
          placeholder="Enter category name"
        />
        {errors.name && (
          <p className="text-red-600 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Slug *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-surface-input text-text-primary ${
              errors.slug ? 'border-red-500' : 'border-border-input'
            }`}
            placeholder="e.g., menswear"
          />
          <button
            type="button"
            onClick={generateSlug}
            className="px-4 py-2 bg-surface-secondary text-text-primary rounded-lg hover:bg-surface-dropdown transition text-sm font-medium"
          >
            Generate
          </button>
        </div>
        {errors.slug && (
          <p className="text-red-600 text-sm mt-1">{errors.slug}</p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Image URL
        </label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-border-input rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-surface-input text-text-primary"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-surface-input text-text-primary ${
            errors.description ? 'border-red-500' : 'border-border-input'
          }`}
          placeholder="Describe the category..."
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex gap-4 pt-6 border-t border-border">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-text-muted disabled:cursor-not-allowed font-medium"
        >
          {isLoading
            ? 'Saving...'
            : category
            ? 'Update Category'
            : 'Create Category'}
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
