'use client';

import { UserForm } from '@/components/admin/UserForm';
import { useUsers } from '@/lib/hooks/useUsers';
import { useRouter } from 'next/navigation';

export default function NewUserPage() {
  const router = useRouter();
  const { addUser, isLoaded } = useUsers();

  const handleSubmit = (data: any) => {
    addUser(data);
    router.push('/admin/users');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
        <p className="text-gray-600 text-sm mt-1">
          Fill in the user details below
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <UserForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}