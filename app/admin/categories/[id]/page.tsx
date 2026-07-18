'use client';

import { CategoryForm } from '@/components/admin/CategoryForm';
import { useCategories } from '@/lib/hooks/useCategories';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Category } from '@/types';

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const { getCategory, updateCategory, isLoaded } = useCategories();
  const [category, setCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const found = getCategory(categoryId);
      if (found) {
        setCategory(found);
      } else {
        router.push('/admin/categories');
      }
    }
  }, [isLoaded, categoryId, getCategory, router]);

  const handleSubmit = async (data: any) => {
    setActionError(null);
    setIsSubmitting(true);
    try {
      await updateCategory(categoryId, data);
      router.push('/admin/categories');
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Failed to update category'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || !category) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Edit Category</h2>
        <p className="text-gray-600 text-sm mt-1">
          Update category information
        </p>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {actionError}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <CategoryForm category={category} onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>

      {/* Category Preview */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Category Name</p>
            <p className="text-gray-900 font-medium">{category.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Slug</p>
            <p className="text-gray-900 font-medium">{category.slug}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Image URL</p>
            <p className="text-gray-900 font-medium truncate">
              {category.imageUrl || '—'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Description</p>
            <p className="text-gray-900 font-medium">
              {category.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}