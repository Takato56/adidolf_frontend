// FILE: takato56-adidolf_frontend/lib/hooks/useProducts.ts

import { Product } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import {
  getProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  getProductById,
  syncProductImagesApi,
  syncProductVariantsApi,
} from '@/lib/products';
import { getCategories } from '@/lib/categories';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const resolveCategoryId = async (categorySlug: string): Promise<number> => {
    const categories = await getCategories();
    const match = categories.find((c) => c.slug === categorySlug);
    if (!match) throw new Error(`Unknown category: ${categorySlug}`);
    return match.category_id;
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const categoryId = await resolveCategoryId(product.categorySlug);
    const created = await createProductApi(product, categoryId);

    if (product.variants?.length) {
      await syncProductVariantsApi(created.id, product.variants);
    }

    const refreshed = await getProductById(created.id);
    setProducts((prev) => [...prev.filter((p) => p.id !== created.id), refreshed]);
    return refreshed;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const categoryId = updates.categorySlug
      ? await resolveCategoryId(updates.categorySlug)
      : undefined;
    await updateProductApi(id, updates, categoryId);

    if (updates.images) {
      await syncProductImagesApi(id, updates.images);
    }

    if (updates.variants) {
      await syncProductVariantsApi(id, updates.variants);
    }

    const refreshed = await getProductById(id);
    setProducts((prev) => prev.map((p) => (p.id === id ? refreshed : p)));
    return refreshed;
  };

  const deleteProduct = async (id: string) => {
    await deleteProductApi(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const getProduct = (id: string) => products.find((p) => p.id === id);

  const fetchProduct = async (id: string) => getProductById(id);

  return {
    products,
    isLoaded,
    error,
    refetch: load,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    fetchProduct,
  };
}