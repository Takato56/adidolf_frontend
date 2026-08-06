// FILE: takato56-adidolf_frontend/app/admin/users/page.tsx

'use client';

import { UserTable } from '@/components/admin/UserTable';
import { useUsers } from '@/lib/hooks/useUsers';
import { exportToCsv } from '@/lib/utils/export';
import { FiDownload } from 'react-icons/fi';

export default function UsersPage() {
  const { users, isLoaded, error } = useUsers();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  const handleExportUsers = () => {
    const formattedData = users.map((u) => ({
      'User ID': u.id,
      'Full Name': u.full_name,
      'Email': u.email,
      'Phone': u.phone || 'N/A',
      'Role': u.role.toUpperCase(),
      'Status': u.is_active ? 'Active' : 'Inactive',
      'Addresses Count': u.addresses?.length || 0,
      'Registered Date': new Date(u.created_at).toLocaleDateString(),
    }));

    exportToCsv('adidolf_users_export', formattedData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage and view registered users
          </p>
        </div>
        <button
          onClick={handleExportUsers}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer font-medium text-sm w-fit"
        >
          <FiDownload size={18} />
          Export CSV
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          Couldn't load users: {error}
        </div>
      )}

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

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <UserTable users={users} />
      </div>
    </div>
  );
}