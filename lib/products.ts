import { fetchWithAuth } from '@/lib/auth';
import { Product } from '@/types';
import { isTestEntry } from '@/lib/utils/testData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ---------- Shapes returned by the backend (src/types/product.types.ts) ----------

interface ApiProductImage {
  image_id: number;
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
}

interface ApiProductVariant {
  variant_id: number;
  sku: string;
  color: string | null;
  size: string | null;
  extra_price: number;
  stock_quantity: number;
  image_url: string | null;
}

interface ApiProductCategory {
  category_id: number;
  name: string;
  slug: string;
  image_url: string | null;
}

export interface ApiProduct {
  product_id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  brand: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category?: ApiProductCategory | null;
  variants?: ApiProductVariant[];
  images?: ApiProductImage[];
}

interface ApiEnvelope<T> {
  status: string;
  data: T;
}

// ---------- Mapping: backend shape <-> frontend shape (types/index.ts) ----------

export function toFrontendProduct(p: ApiProduct): Product {
  const sortedImages = (p.images ?? [])
    .slice()
    .sort((a, b) =>
      a.is_primary === b.is_primary ? a.sort_order - b.sort_order : a.is_primary ? -1 : 1
    );

  return {
    id: String(p.product_id),
    name: p.name,
    categorySlug: p.category?.slug ?? '',
    slug: p.slug,
    description: p.description ?? '',
    price: p.base_price,
    brand: p.brand ?? '',
    isPublished: p.is_published,
    variants: (p.variants ?? []).map((v) => ({
      id: String(v.variant_id),
      color: v.color ?? undefined,
      size: v.size ?? undefined,
      extra_price: v.extra_price,
      stock: v.stock_quantity,
      image_url: v.image_url ?? undefined,
    })),
    images: sortedImages.length > 0 ? sortedImages.map((img) => img.image_url) : [''],
  };
}

const isValidUrl = (value: string): boolean => {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export interface ProductFilters {
  category_id?: number;
  brand?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
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

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.set(key, String(value));
    });
  }
  const query = params.toString();
  const res = await fetch(`${BASE_URL}/products${query ? `?${query}` : ''}`);
  const data = await unwrap<ApiProduct[]>(res, 'Failed to fetch products');
  return data
    .filter((p) => !isTestEntry(p.name) && !isTestEntry(p.slug))
    .map(toFrontendProduct);
}

export async function getProductById(id: string | number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  const data = await unwrap<ApiProduct>(res, 'Failed to fetch product');
  if (isTestEntry(data.name) || isTestEntry(data.slug)) {
    throw new Error('Product not found (404)');
  }
  return toFrontendProduct(data);
}

export async function getProductBySlug(slug: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/slug/${slug}`);
  const data = await unwrap<ApiProduct>(res, 'Failed to fetch product');
  if (isTestEntry(data.name) || isTestEntry(data.slug)) {
    throw new Error('Product not found (404)');
  }
  return toFrontendProduct(data);
}

// ---------- Writes (admin only, require auth) ----------

export async function createProductApi(
  product: Omit<Product, 'id'>,
  categoryId: number
): Promise<Product> {
  const images = product.images
    .filter((url) => isValidUrl(url))
    .map((url, index) => ({ image_url: url, is_primary: index === 0, sort_order: index }));

  const res = await fetchWithAuth(`${BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      category_id: categoryId,
      name: product.name,
      slug: product.slug || undefined,
      description: product.description || undefined,
      base_price: product.price,
      brand: product.brand || undefined,
      is_published: product.isPublished,
      images: images.length > 0 ? images : undefined,
    }),
  });
  const data = await unwrap<ApiProduct>(res, 'Failed to create product');
  return toFrontendProduct(data);
}

export async function updateProductApi(
  id: string | number,
  updates: Partial<Omit<Product, 'id'>>,
  categoryId?: number
): Promise<Product> {
  const res = await fetchWithAuth(`${BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(categoryId !== undefined ? { category_id: categoryId } : {}),
      ...(updates.name !== undefined ? { name: updates.name } : {}),
      ...(updates.slug !== undefined ? { slug: updates.slug } : {}),
      ...(updates.description !== undefined ? { description: updates.description } : {}),
      ...(updates.price !== undefined ? { base_price: updates.price } : {}),
      ...(updates.brand !== undefined ? { brand: updates.brand } : {}),
      ...(updates.isPublished !== undefined ? { is_published: updates.isPublished } : {}),
    }),
  });
  const data = await unwrap<ApiProduct>(res, 'Failed to update product');
  return toFrontendProduct(data);
}

export async function deleteProductApi(id: string | number): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/products/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete product (${res.status})`);
  }
}

// ---------- Images (separate sub-resource on the backend — PUT /products/:id
// never touches these, so they need their own calls) ----------

export async function getProductImagesApi(
  id: string | number
): Promise<ApiProductImage[]> {
  const res = await fetch(`${BASE_URL}/products/${id}/images`);
  return unwrap<ApiProductImage[]>(res, 'Failed to fetch product images');
}

export async function addProductImagesApi(
  id: string | number,
  urls: string[]
): Promise<ApiProductImage[]> {
  const images = urls
    .filter((url) => isValidUrl(url))
    .map((url, index) => ({ image_url: url, sort_order: index }));

  if (images.length === 0) return [];

  const res = await fetchWithAuth(`${BASE_URL}/products/${id}/images`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ images }),
  });
  return unwrap<ApiProductImage[]>(res, 'Failed to add product images');
}

export async function deleteProductImageApi(
  productId: string | number,
  imageId: number
): Promise<void> {
  const res = await fetchWithAuth(
    `${BASE_URL}/products/${productId}/images/${imageId}`,
    { method: 'DELETE' }
  );
  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete product image (${res.status})`);
  }
}

// Real image upload — goes through the backend ONLY for the actual upload
// step, because writing to Supabase Storage requires the service-role key,
// which must stay server-side (that's what POST /:id/images/upload does:
// receives the file, uploads it to the bucket, and creates the
// product_images row itself). Everything AFTER that — every time this image
// is displayed — hits the returned public bucket URL directly via <img
// src>, never through the backend again. That split (upload via backend,
// serve directly from the bucket) is intentional, not a shortcut: proxying
// every image read through Express would bottleneck it for no reason.
export async function uploadProductImagesApi(
  productId: string | number,
  files: File[]
): Promise<ApiProductImage[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const res = await fetchWithAuth(`${BASE_URL}/products/${productId}/images/upload`, {
    method: 'POST',
    // No Content-Type header here on purpose — the browser sets the
    // multipart/form-data boundary itself. Setting it manually breaks it.
    body: formData,
  });
  return unwrap<ApiProductImage[]>(res, 'Failed to upload product images');
}

// Reconciles a product's images with whatever URLs are currently in the
// edit form, since PUT /products/:id doesn't touch the images table at all.
// Anything removed from the form gets deleted; anything new gets created;
// unchanged URLs are left alone.
export async function syncProductImagesApi(
  id: string | number,
  desiredUrls: string[]
): Promise<void> {
  const current = await getProductImagesApi(id);
  const desired = desiredUrls.filter((url) => isValidUrl(url));

  const toDelete = current.filter((img) => !desired.includes(img.image_url));
  const toAdd = desired.filter(
    (url) => !current.some((img) => img.image_url === url)
  );

  await Promise.all(toDelete.map((img) => deleteProductImageApi(id, img.image_id)));
  if (toAdd.length > 0) {
    await addProductImagesApi(id, toAdd);
  }
}