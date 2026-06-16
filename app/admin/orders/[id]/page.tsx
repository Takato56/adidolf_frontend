'use client';

import { OrderForm } from '@/components/admin/OrderForm';
import { useOrders } from '@/lib/hooks/useOrders';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { Order } from '@/types';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = parseInt(params.id as string) || 0;
  const { getOrder, updateOrder, deleteOrder, isLoaded } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const found = getOrder(orderId);
      if (found) {
        setOrder(found);
      } else {
        router.push('/admin/orders');
      }
    }
  }, [isLoaded, orderId, getOrder, router]);

  const handleSubmit = (data: any) => {
    updateOrder(orderId, data);
    router.push('/admin/orders');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId);
      router.push('/admin/orders');
    }
  };

  if (!isLoaded || !order) {
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
          <h2 className="text-2xl font-bold text-gray-900">
            Edit Order #{order.id}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Update order information
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          <FiTrash2 size={18} />
          Delete Order
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <OrderForm order={order} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}