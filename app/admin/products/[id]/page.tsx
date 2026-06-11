'use client';

import { ProductForm } from '@/components/admin/ProductForm';
import { useProducts } from '@/lib/hooks/useProducts';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { getProduct, updateProduct, deleteProduct, isLoaded } =
    useProducts();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const found = getProduct(productId);
      if (found) {
        setProduct(found);
      } else {
        router.push('/admin/products');
      }
    }
  }, [isLoaded, productId, getProduct, router]);

  const handleSubmit = (data: any) => {
    updateProduct(productId, data);
    router.push('/admin/products');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      router.push('/admin/products');
    }
  };

  if (!isLoaded || !product) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
          <p className="text-gray-600 text-sm mt-1">
            Update product information
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          <FiTrash2 size={18} />
          Delete Product
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <ProductForm product={product} onSubmit={handleSubmit} />
      </div>

      {/* Product Preview */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Product Name</p>
            <p className="text-gray-900 font-medium">{product.name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">SKU</p>
            <p className="text-gray-900 font-medium">{product.sku}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Category</p>
            <p className="text-gray-900 font-medium capitalize">
              {product.categorySlug}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Price</p>
            <p className="text-gray-900 font-medium">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Stock</p>
            <p className="text-gray-900 font-medium">{product.stock} units</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Attributes</p>
            <p className="text-gray-900 font-medium">{product.attributes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
