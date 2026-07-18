'use client';

import Link from 'next/link';
import { FiEdit2, FiEye } from 'react-icons/fi';

interface CategoryActionsProps {
  categoryId: string;
}

// Categories can't be deleted: products reference categories via a
// category_id foreign key, so the database rejects the delete outright
// whenever any product (even a soft-deleted/unpublished one) still points
// at it. Rather than surface that as a dead-end error every time, deletion
// is just not offered here.
export function CategoryActions({ categoryId }: CategoryActionsProps) {
  return (
    <div className="flex items-center space-x-3">
      <Link
        href={`/admin/categories/${categoryId}`}
        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
        title="View/Edit"
      >
        <FiEye size={18} />
      </Link>
      <Link
        href={`/admin/categories/${categoryId}`}
        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
        title="Edit"
      >
        <FiEdit2 size={18} />
      </Link>
    </div>
  );
}