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
            <p className="text-gray-600 text-sm">Category</p>
            <p className="text-gray-900 font-medium capitalize">
              {product.categorySlug}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Slug</p>
            <p className="text-gray-900 font-medium">{product.slug}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Price</p>
            <p className="text-gray-900 font-medium">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Brand</p>
            <p className="text-gray-900 font-medium">{product.brand}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Published</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.isPublished
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {product.isPublished ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-600 text-sm">Description</p>
          <p className="text-gray-900 font-medium mt-1">
            {product.description || '—'}
          </p>
        </div>

        <div className="mt-6">
          <p className="text-gray-600 text-sm mb-2">
            Variants ({product.variants?.length || 0})
          </p>
          <div className="space-y-2">
            {(product.variants || []).map((v, i) => (
              <div
                key={v.id || i}
                className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-gray-900 font-medium text-sm">
                  {v.name}
                </span>
                <span className="text-gray-600 text-sm">
                  ${v.price.toFixed(2)} —{' '}
                  <span
                    className={
                      v.stock > 5
                        ? 'text-green-600 font-medium'
                        : 'text-red-600 font-medium'
                    }
                  >
                    {v.stock} in stock
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-600 text-sm mb-2">
            Images ({product.images?.length || 0})
          </p>
          <div className="flex flex-wrap gap-3">
            {(product.images || []).map((img, i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center"
              >
                {img ? (
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No image</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
