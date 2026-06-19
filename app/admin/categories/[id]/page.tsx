'use client';

import { CategoryForm } from '@/components/admin/CategoryForm';
import { useCategories } from '@/lib/hooks/useCategories';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { Category } from '@/types';

export default function CategoryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
  const { getCategory, updateCategory, deleteCategory, isLoaded } =
    useCategories();
  const [category, setCategory] = useState<Category | null>(null);

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

  const handleSubmit = (data: any) => {
    updateCategory(categoryId, data);
    router.push('/admin/categories');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(categoryId);
      router.push('/admin/categories');
    }
  };

  if (!isLoaded || !category) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Edit Category</h2>
          <p className="text-text-muted text-sm mt-1">
            Update category information
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          <FiTrash2 size={18} />
          Delete Category
        </button>
      </div>

      <div className="bg-surface-elevated rounded-lg shadow-md border border-border p-6">
        <CategoryForm category={category} onSubmit={handleSubmit} />
      </div>

      {/* Category Preview */}
      <div className="bg-surface-elevated rounded-lg shadow-md border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-text-muted text-sm">Category Name</p>
            <p className="text-text-primary font-medium">{category.name}</p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Slug</p>
            <p className="text-text-primary font-medium">{category.slug}</p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Image URL</p>
            <p className="text-text-primary font-medium truncate">
              {category.imageUrl || '—'}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Description</p>
            <p className="text-text-primary font-medium">
              {category.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
