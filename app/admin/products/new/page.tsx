'use client';

import { ProductForm } from '@/components/admin/ProductForm';
import { useProducts } from '@/lib/hooks/useProducts';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct, isLoaded } = useProducts();

  const handleSubmit = (data: any) => {
    addProduct(data);
    router.push('/admin/products');
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

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
