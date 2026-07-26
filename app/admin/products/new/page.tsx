'use client';

import { ProductForm } from '@/components/admin/ProductForm';
import { useProducts } from '@/lib/hooks/useProducts';
import { uploadProductImagesApi } from '@/lib/products';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct, isLoaded } = useProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const { imageFiles, ...productData } = data;
      const created = await addProduct(productData);

      // Uploaded files can only go up after the product exists (the upload
      // endpoint needs a real product id) — this uploads them straight to
      // Supabase Storage via the backend and creates their product_images
      // rows in one call.
      if (imageFiles?.length) {
        await uploadProductImagesApi(created.id, imageFiles);
      }

      router.push('/admin/products');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to create product'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
        <p className="text-gray-600 text-sm mt-1">
          Fill in the product details below
        </p>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {submitError}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <ProductForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
}