'use client';

import { DataTable } from '@/components/admin/DataTable';
import { FiDownload, FiFilter } from 'react-icons/fi';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  joinDate: string;
}

// Mock data for users
const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'Active',
    joinDate: '2025-01-15',
  },
  {
    id: 'USR-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'Active',
    joinDate: '2025-02-20',
  },
  {
    id: 'USR-003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    status: 'Inactive',
    joinDate: '2024-12-10',
  },
  {
    id: 'USR-004',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    status: 'Active',
    joinDate: '2025-03-05',
  },
  {
    id: 'USR-005',
    name: 'Robert Brown',
    email: 'robert@example.com',
    status: 'Active',
    joinDate: '2025-04-12',
  },
];

const columns = [
  { key: 'id', label: 'User ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  { key: 'joinDate', label: 'Join Date' },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage and view registered users
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

      {/* Users Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {mockUsers.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Active Users</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {mockUsers.filter((u) => u.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Inactive Users</p>
          <p className="text-2xl font-bold text-gray-600 mt-2">
            {mockUsers.filter((u) => u.status === 'Inactive').length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <DataTable columns={columns} data={mockUsers} title="Users" />
      </div>
    </div>
  );
}
