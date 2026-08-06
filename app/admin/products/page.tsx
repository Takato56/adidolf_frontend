// FILE: takato56-adidolf_frontend/app/admin/products/page.tsx

'use client';

import { ProductTable } from '@/components/admin/ProductTable';
import { useProducts } from '@/lib/hooks/useProducts';
import { exportToCsv } from '@/lib/utils/export';
import { FiPlus, FiDownload } from 'react-icons/fi';
import Link from 'next/link';

export default function ProductsPage() {
  const { products, isLoaded } = useProducts();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading products...</div>
      </div>
    );
  }

  const getTotalStock = (p: typeof products[number]) =>
    Array.isArray(p.variants)
      ? p.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
      : 0;

  const lowStockCount = products.filter((p) => getTotalStock(p) < 20).length;
  const totalValue = products.reduce(
    (sum, p) => sum + p.price * getTotalStock(p),
    0
  );

  const handleExportProducts = () => {
    const formattedData = products.map((p) => {
      const stock = getTotalStock(p);
      return {
        'Product ID': p.id,
        'Name': p.name,
        'Category': p.categorySlug,
        'Brand': p.brand,
        'Price ($)': p.price,
        'Total Stock': stock,
        'Published Status': p.isPublished ? 'Yes' : 'No',
        'Variants Count': p.variants?.length || 0,
        'Slug': p.slug,
        'Description': p.description,
      };
    });

    exportToCsv('adidolf_products_catalog', formattedData);
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Product Inventory
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage and organize your product catalog
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportProducts}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer font-medium text-sm"
          >
            <FiDownload size={18} />
            Export CSV
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <FiPlus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {products.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Low Stock</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {lowStockCount}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Value</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ${totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <ProductTable products={products} />
      </div>
    </div>
  );
}