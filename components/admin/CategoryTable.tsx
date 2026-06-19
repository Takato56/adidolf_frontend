'use client';

import { Category } from '@/types';
import { CategoryActions } from './CategoryActions';
import Link from 'next/link';

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        No categories found.{' '}
        <Link
          href="/admin/categories/new"
          className="text-blue-600 hover:underline"
        >
          Add one now
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-surface-secondary border-b border-border">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
              Category Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
              Slug
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
              Image URL
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
              Description
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-divider">
          {categories.map((category) => (
            <tr
              key={category.id}
              className="hover:bg-surface-secondary transition-colors"
            >
              <td className="px-6 py-4 text-sm text-text-primary font-medium">
                {category.name}
              </td>
              <td className="px-6 py-4 text-sm text-text-muted">
                {category.slug}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                {category.imageUrl || '—'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 max-w-[250px] truncate">
                {category.description || '—'}
              </td>
              <td className="px-6 py-4 text-sm">
                <CategoryActions categoryId={category.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
