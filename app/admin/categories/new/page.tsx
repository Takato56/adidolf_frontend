'use client';

import { CategoryForm } from '@/components/admin/CategoryForm';
import { useCategories } from '@/lib/hooks/useCategories';
import { useRouter } from 'next/navigation';

export default function NewCategoryPage() {
  const router = useRouter();
  const { addCategory, isLoaded } = useCategories();

  const handleSubmit = (data: any) => {
    addCategory(data);
    router.push('/admin/categories');
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
        <h2 className="text-2xl font-bold text-text-primary">
          Add New Category
        </h2>
        <p className="text-text-muted text-sm mt-1">
          Fill in the category details below
        </p>
      </div>

      <div className="bg-surface-elevated rounded-lg shadow-md border border-border p-6">
        <CategoryForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
