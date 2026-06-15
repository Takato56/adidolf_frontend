'use client';

import { CategoryTable } from '@/components/admin/CategoryTable';
import { useCategories } from '@/lib/hooks/useCategories';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function CategoriesPage() {
  const { categories, isLoaded } = useCategories();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage product categories
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus size={18} />
            Add Category
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">
            Total Categories
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {categories.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">
            Categories With Images
          </p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {categories.filter((c) => c.imageUrl).length}
          </p>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <CategoryTable categories={categories} />
      </div>
    </div>
  );
}
