'use client';

import { OrderForm } from '@/components/admin/OrderForm';
import { useOrders } from '@/lib/hooks/useOrders';
import { useRouter } from 'next/navigation';

export default function NewOrderPage() {
  const router = useRouter();
  const { addOrder, isLoaded } = useOrders();

  const handleSubmit = (data: any) => {
    addOrder(data);
    router.push('/admin/orders');
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
        <h2 className="text-2xl font-bold text-text-primary">Add New Order</h2>
        <p className="text-text-muted text-sm mt-1">
          Fill in the order details below
        </p>
      </div>

      <div className="bg-surface-elevated rounded-lg shadow-md border border-border p-6">
        <OrderForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}