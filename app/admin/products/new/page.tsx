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
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Add New Product</h2>
        <p className="text-text-muted text-sm mt-1">
          Fill in the product details below
        </p>
      </div>

      <div className="bg-surface-elevated rounded-lg shadow-md border border-border p-6">
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
