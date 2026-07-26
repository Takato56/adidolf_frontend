'use client';

import { UserTable } from '@/components/admin/UserTable';
import { useUsers } from '@/lib/hooks/useUsers';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function UsersPage() {
  const { users, isLoaded, error } = useUsers();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

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
          <Link
            href="/admin/users/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus size={18} />
            Add User
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          Couldn't load users: {error}
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {users.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Active Users</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {users.filter((u) => u.is_active).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Admin Users</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <UserTable users={users} />
      </div>
    </div>
  );
}