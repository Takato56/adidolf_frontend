import { Category } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import {
  getCategoriesForFrontend,
  createCategoryApi,
  updateCategoryApi,
} from '@/lib/categories';

// Note: there is intentionally no deleteCategory here. Categories can't be
// deleted while any product (even a soft-deleted/unpublished one) still
// references it via the category_id foreign key — the backend rejects it
// outright, so it's not offered as an action in the UI.
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getCategoriesForFrontend();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addCategory = async (category: Omit<Category, 'id'>) => {
    const created = await createCategoryApi(category);
    setCategories((prev) => [...prev, created]);
    return created;
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const updated = await updateCategoryApi(id, updates);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  };

  const getCategory = (id: string) => categories.find((c) => c.id === id);

  return {
    categories,
    isLoaded,
    error,
    refetch: load,
    addCategory,
    updateCategory,
    getCategory,
  };
}