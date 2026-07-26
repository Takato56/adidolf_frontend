import { fetchWithAuth } from '@/lib/auth';
import { Category } from '@/types';
import { isTestEntry } from '@/lib/utils/testData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiCategory {
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

interface ApiEnvelope<T> {
  status: string;
  data: T;
}

function toFrontendCategory(c: ApiCategory): Category {
  return {
    id: String(c.category_id),
    name: c.name,
    slug: c.slug,
    imageUrl: c.image_url ?? '',
    description: c.description ?? '',
  };
}

async function unwrap<T>(res: Response, fallbackMessage: string): Promise<T> {
  if (!res.ok) {
    let message = fallbackMessage;
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // ignore body parse errors
    }
    throw new Error(`${message} (${res.status})`);
  }
  const json: ApiEnvelope<T> = await res.json();
  return json.data;
}

// ---------- Reads (public, no auth) ----------

export async function getCategories(): Promise<ApiCategory[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  const data = await unwrap<ApiCategory[]>(res, 'Failed to fetch categories');
  return data.filter((c) => !isTestEntry(c.name) && !isTestEntry(c.slug));
}

export async function getCategoriesForFrontend(): Promise<Category[]> {
  const categories = await getCategories();
  return categories.map(toFrontendCategory);
}

export async function getCategoryById(id: string | number): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories/${id}`);
  const data = await unwrap<ApiCategory>(res, 'Failed to fetch category');
  if (isTestEntry(data.name) || isTestEntry(data.slug)) {
    throw new Error('Category not found (404)');
  }
  return toFrontendCategory(data);
}

// ---------- Writes (admin only, require auth) ----------

export async function createCategoryApi(
  category: Omit<Category, 'id'>
): Promise<Category> {
  const res = await fetchWithAuth(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: category.name,
      slug: category.slug || undefined,
      description: category.description || undefined,
      image_url: category.imageUrl || undefined,
    }),
  });
  const data = await unwrap<ApiCategory>(res, 'Failed to create category');
  return toFrontendCategory(data);
}

export async function updateCategoryApi(
  id: string | number,
  updates: Partial<Omit<Category, 'id'>>
): Promise<Category> {
  const res = await fetchWithAuth(`${BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(updates.name !== undefined ? { name: updates.name } : {}),
      ...(updates.slug !== undefined ? { slug: updates.slug } : {}),
      ...(updates.description !== undefined ? { description: updates.description } : {}),
      ...(updates.imageUrl !== undefined ? { image_url: updates.imageUrl || undefined } : {}),
    }),
  });
  const data = await unwrap<ApiCategory>(res, 'Failed to update category');
  return toFrontendCategory(data);
}

export async function deleteCategoryApi(id: string | number): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/categories/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    let message = 'Failed to delete category';
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // ignore
    }
    throw new Error(`${message} (${res.status})`);
  }
}