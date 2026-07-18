'use client';

import Link from 'next/link';
import { FiArrowLeft, FiAlertTriangle } from 'react-icons/fi';

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-2"
        >
          <FiArrowLeft size={16} />
          Back to Users
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 flex gap-4">
        <FiAlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={24} />
        <div className="space-y-2 text-sm text-amber-900">
          <p className="font-semibold">Creating users isn't available from this panel.</p>
          <p>
            User passwords are hashed with argon2 during normal signup
            (<code className="bg-amber-100 px-1 rounded">/auth/register</code>).
            The admin panel talks to a generic backend endpoint that inserts
            whatever it's given directly into the database with no hashing —
            creating a user here would either break their login permanently
            or store their password in plain text.
          </p>
          <p>
            Have the person sign up normally through the storefront, then
            come back here to manage their role, active status, or details.
          </p>
        </div>
      </div>

      <Link
        href="/admin/users"
        className="inline-block px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
      >
        Back to Users
      </Link>
    </div>
  );
}