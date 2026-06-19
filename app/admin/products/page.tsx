'use client';

import { ProductTable } from '@/components/admin/ProductTable';
import { useProducts } from '@/lib/hooks/useProducts';
import { FiPlus, FiDownload } from 'react-icons/fi';
import Link from 'next/link';

export default function ProductsPage() {
  const { products, isLoaded } = useProducts();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-muted">Loading products...</div>
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

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">
            Product Inventory
          </h2>
          <p className="text-text-muted text-sm mt-1">
            Manage and organize your product catalog
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-elevated border border-border-input rounded-lg text-text-primary hover:bg-surface-secondary transition-colors">
            <FiDownload size={18} />
            Export
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus size={18} />
            Add Product
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface-elevated rounded-lg shadow-md p-4 border border-border">
          <p className="text-text-muted text-sm font-medium">Total Products</p>
          <p className="text-2xl font-bold text-text-primary mt-2">
            {products.length}
          </p>
        </div>
        <div className="bg-surface-elevated rounded-lg shadow-md p-4 border border-border">
          <p className="text-text-muted text-sm font-medium">Low Stock</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {lowStockCount}
          </p>
        </div>
        <div className="bg-surface-elevated rounded-lg shadow-md p-4 border border-border">
          <p className="text-text-muted text-sm font-medium">Total Value</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ${totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-surface-elevated rounded-lg shadow-md border border-border">
        <ProductTable products={products} />
      </div>
    </div>
  );
}
