'use client';

import { UserForm } from '@/components/admin/UserForm';
import { useUsers } from '@/lib/hooks/useUsers';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { User } from '@/types';
import Link from 'next/link';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = parseInt(params.id as string) || 0;
  const { getUser, updateUser, deleteUser, isLoaded } = useUsers();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const found = getUser(userId);
      if (found) {
        setUser(found);
      } else {
        router.push('/admin/users');
      }
    }
  }, [isLoaded, userId, getUser, router]);

  const handleSubmit = (data: any) => {
    updateUser(userId, data);
    router.push('/admin/users');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      router.push('/admin/users');
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-2"
          >
            <FiArrowLeft size={16} />
            Back to Users
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            Edit User #{user.id}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Update user information
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          <FiTrash2 size={18} />
          Delete User
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <UserForm user={user} onSubmit={handleSubmit} />
      </div>

      {/* User Preview */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          User Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Full Name</p>
            <p className="text-gray-900 font-medium">{user.full_name}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="text-gray-900 font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Phone</p>
            <p className="text-gray-900 font-medium">{user.phone || '—'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Role</p>
            <p className="text-gray-900 font-medium capitalize">{user.role}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.is_active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {user.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Created</p>
            <p className="text-gray-900 font-medium">
              {new Date(user.created_at).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Addresses</p>
            <p className="text-gray-900 font-medium">
              {user.addresses.length} address
              {user.addresses.length !== 1 ? 'es' : ''}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Avatar</p>
            <p className="text-gray-900 font-medium truncate">
              {user.avatar_url || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Addresses Preview */}
      {user.addresses.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Addresses
          </h3>
          <div className="space-y-4">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {addr.recipient_name}
                  </span>
                  <span className="text-sm text-gray-500">|</span>
                  <span className="text-sm text-gray-600">{addr.phone}</span>
                  {addr.is_default === 1 && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {addr.street_detail}, {addr.ward}, {addr.district},{' '}
                  {addr.province}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}