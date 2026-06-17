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
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Add New Category
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Fill in the category details below
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <CategoryForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
