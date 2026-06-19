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
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Edit Product</h2>
          <p className="text-text-muted text-sm mt-1">
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

      <div className="bg-surface-elevated rounded-lg shadow-md border border-border p-6">
        <ProductForm product={product} onSubmit={handleSubmit} />
      </div>

      {/* Product Preview */}
      <div className="bg-surface-elevated rounded-lg shadow-md border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Preview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-text-muted text-sm">Product Name</p>
            <p className="text-text-primary font-medium">{product.name}</p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Category</p>
            <p className="text-text-primary font-medium capitalize">
              {product.categorySlug}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Slug</p>
            <p className="text-text-primary font-medium">{product.slug}</p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Price</p>
            <p className="text-text-primary font-medium">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Brand</p>
            <p className="text-text-primary font-medium">{product.brand}</p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Published</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                product.isPublished
                  ? 'bg-green-100 text-green-800'
                  : 'bg-surface-secondary text-text-muted'
              }`}
            >
              {product.isPublished ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-text-muted text-sm">Description</p>
          <p className="text-text-primary font-medium mt-1">
            {product.description || '—'}
          </p>
        </div>

        <div className="mt-6">
          <p className="text-text-muted text-sm mb-2">
            Variants ({product.variants?.length || 0})
          </p>
          <div className="space-y-2">
            {(product.variants || []).map((v, i) => (
              <div
                key={v.id || i}
                className="flex items-center justify-between px-4 py-2 bg-surface-secondary rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-text-primary font-medium text-sm">
                    {[v.color, v.size].filter(Boolean).join(' / ') || 'Default'}
                  </span>
                  {v.extra_price > 0 && (
                    <span className="text-xs text-blue-600 font-medium">
                      +${v.extra_price.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {v.image_url && (
                    <img
                      src={v.image_url}
                      alt=""
                      className="w-6 h-6 rounded object-cover"
                    />
                  )}
                  <span
                    className={
                      v.stock > 5
                        ? 'text-green-600 font-medium text-sm'
                        : 'text-red-600 font-medium text-sm'
                    }
                  >
                    {v.stock} in stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-text-muted text-sm mb-2">
            Images ({product.images?.length || 0})
          </p>
          <div className="flex flex-wrap gap-3">
            {(product.images || []).map((img, i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-lg border border-border bg-surface-secondary overflow-hidden flex items-center justify-center"
              >
                {img ? (
                  <img
                    src={img}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-text-muted">No image</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
