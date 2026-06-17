'use client';

import Link from 'next/link';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { useUsers } from '@/lib/hooks/useUsers';

interface UserActionsProps {
  userId: number;
}

export function UserActions({ userId }: UserActionsProps) {
  const { deleteUser } = useUsers();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Link
        href={`/admin/users/${userId}`}
        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
        title="View/Edit"
      >
        <FiEye size={18} />
      </Link>
      <Link
        href={`/admin/users/${userId}`}
        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
        title="Edit"
      >
        <FiEdit2 size={18} />
      </Link>
      <button
        onClick={handleDelete}
        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
        title="Delete"
      >
        <FiTrash2 size={18} />
      </button>
    </div>
  );
}
