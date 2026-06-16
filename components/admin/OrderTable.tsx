'use client';

import { Order } from '@/types';
import { OrderActions } from './OrderActions';
import Link from 'next/link';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipping: 'bg-purple-100 text-purple-800',
  done: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No orders found.{' '}
        <Link
          href="/admin/orders/new"
          className="text-blue-600 hover:underline"
        >
          Add one now
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              User
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Items
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Total
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Date
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                {order.id}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {order.userId}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                ${order.totalPrice.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <OrderActions orderId={order.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}