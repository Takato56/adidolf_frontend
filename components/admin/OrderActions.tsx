'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { useOrders } from '@/lib/hooks/useOrders';

interface OrderActionsProps {
  orderId: number;
}

export function OrderActions({ orderId }: OrderActionsProps) {
  const { deleteOrder } = useOrders();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    setError(null);
    setIsDeleting(true);
    try {
      await deleteOrder(orderId);
      window.location.reload();
    } catch (err) {
      setIsDeleting(false);
      setError(err instanceof Error ? err.message : 'Failed to delete order');
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center space-x-3">
        <Link
          href={`/admin/orders/${orderId}`}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          title="View/Edit"
        >
          <FiEye size={18} />
        </Link>
        <Link
          href={`/admin/orders/${orderId}`}
          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
          title="Edit"
        >
          <FiEdit2 size={18} />
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
          title="Delete"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
      {error && (
        <span className="text-xs text-red-600 max-w-[200px] text-right">
          {error}
        </span>
      )}
    </div>
  );
}