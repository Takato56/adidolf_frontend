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
      <div className="text-center py-8 text-gray-500">
        No products found. <Link href="/admin/products/new" className="text-blue-600 hover:underline">Add one now</Link>.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Product Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              SKU
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Category
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Price
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                {product.name}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {product.categorySlug}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                ${product.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    product.stock > 20
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 5
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.stock} units
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <ProductActions productId={product.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
