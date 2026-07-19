'use client';

import { OrderForm } from '@/components/admin/OrderForm';
import { useOrders } from '@/lib/hooks/useOrders';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewOrderPage() {
  const router = useRouter();
  const { addOrder, isLoaded } = useOrders();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await addOrder(data);
      router.push('/admin/orders');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to create order'
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
        <h2 className="text-2xl font-bold text-gray-900">Add New Order</h2>
        <p className="text-gray-600 text-sm mt-1">
          Fill in the order details below
        </p>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {submitError}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <OrderForm onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>
    </div>
  );
}