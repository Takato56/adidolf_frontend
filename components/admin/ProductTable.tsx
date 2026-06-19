'use client';

import { Product } from '@/types';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { ProductActions } from './ProductActions';
import Link from 'next/link';

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        No products found. <Link href="/admin/products/new" className="text-blue-600 hover:underline">Add one now</Link>.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-surface-secondary border-b border-border">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
              Product Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
              Category
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
              Brand
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
              Price
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
              Published
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-text-primary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-divider">
          {products.map((product) => {
            const totalStock = Array.isArray(product.variants)
              ? product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
              : 0;
            return (
              <tr
                key={product.id}
                className="hover:bg-surface-secondary transition-colors"
              >
                <td className="px-6 py-4 text-sm text-text-primary font-medium">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {product.categorySlug}
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {product.brand}
                </td>
                <td className="px-6 py-4 text-sm text-text-primary font-medium">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      totalStock > 20
                        ? 'bg-green-100 text-green-800'
                        : totalStock > 5
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {totalStock} units
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {product.isPublished ? (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Yes
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <ProductActions productId={product.id} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
