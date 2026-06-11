'use client';

import { DataTable } from '@/components/admin/DataTable';
import { FiDownload, FiFilter } from 'react-icons/fi';

interface Order {
  id: string;
  customer: string;
  amount: string;
  status: string;
  date: string;
}

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    amount: '$125.99',
    status: 'Completed',
    date: '2025-06-10',
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    amount: '$89.50',
    status: 'Processing',
    date: '2025-06-10',
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    amount: '$245.00',
    status: 'Pending',
    date: '2025-06-09',
  },
  {
    id: 'ORD-004',
    customer: 'Sarah Williams',
    amount: '$165.75',
    status: 'Shipped',
    date: '2025-06-09',
  },
  {
    id: 'ORD-005',
    customer: 'Robert Brown',
    amount: '$299.99',
    status: 'Completed',
    date: '2025-06-08',
  },
];

const columns = [
  { key: 'id', label: 'Order ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
  { key: 'date', label: 'Date' },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
          <p className="text-gray-600 text-sm mt-1">
            View and manage customer orders
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <FiFilter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <FiDownload size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Orders Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {mockOrders.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Completed</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {mockOrders.filter((o) => o.status === 'Completed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Processing</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {mockOrders.filter((o) => o.status === 'Processing').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Pending</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {mockOrders.filter((o) => o.status === 'Pending').length}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <DataTable columns={columns} data={mockOrders} title="Orders" />
      </div>
    </div>
  );
}
