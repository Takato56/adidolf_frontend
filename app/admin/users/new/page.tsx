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
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">Add New User</h2>
        <p className="text-text-muted text-sm mt-1">
          Fill in the user details below
        </p>
      </div>

      <div className="bg-surface-elevated rounded-lg shadow-md border border-border p-6">
        <UserForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}