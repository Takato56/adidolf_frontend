import { Product } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import {
  getProducts,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  getProductById,
  syncProductImagesApi,
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

  // category_id is required by the backend but the frontend Product model only
  // carries categorySlug, so resolve it against /categories before writing.
  const resolveCategoryId = async (categorySlug: string): Promise<number> => {
    const categories = await getCategories();
    const match = categories.find((c) => c.slug === categorySlug);
    if (!match) throw new Error(`Unknown category: ${categorySlug}`);
    return match.category_id;
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const categoryId = await resolveCategoryId(product.categorySlug);
    const created = await createProductApi(product, categoryId);
    setProducts((prev) => [...prev, created]);
    return created;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const categoryId = updates.categorySlug
      ? await resolveCategoryId(updates.categorySlug)
      : undefined;
    await updateProductApi(id, updates, categoryId);

    // PUT /products/:id only touches the product row itself — images live in
    // a separate table with their own endpoints, so they need a separate,
    // explicit sync pass against whatever URLs are in the form now.
    if (updates.images) {
      await syncProductImagesApi(id, updates.images);
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

  // Fetches a single product straight from the API (bypasses local cache).
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