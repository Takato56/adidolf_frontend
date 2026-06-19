'use client';

import { User } from '@/types';
import { UserActions } from './UserActions';
import Link from 'next/link';

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted">
        No users found.{' '}
        <Link
          href="/admin/users/new"
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
        <thead className="bg-surface-secondary border-b border-border">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Full Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Email
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Role
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Addresses
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Created
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-divider">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-surface-secondary transition-colors"
            >
              <td className="px-6 py-4 text-sm text-text-primary font-medium">
                #{user.id}
              </td>
              <td className="px-6 py-4 text-sm text-text-primary font-medium">
                {user.full_name}
              </td>
              <td className="px-6 py-4 text-sm text-text-muted">
                {user.email}
              </td>
              <td className="px-6 py-4 text-sm text-text-muted">
                {user.phone || '—'}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-text-muted">
                {user.addresses.length} address
                {user.addresses.length !== 1 ? 'es' : ''}
              </td>
              <td className="px-6 py-4 text-sm text-text-muted">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-sm">
                <UserActions userId={user.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}