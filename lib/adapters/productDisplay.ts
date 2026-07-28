// FILE: takato56-adidolf_frontend/lib/adapters/productDisplay.ts

import { Product } from '@/types';

export interface ProductCardData {
  image: string;
  category: string;
  name: string;
  price: string;
  shopLink: string;
  alt?: string;
}

export function toProductCardData(p: Product): ProductCardData {
  const image = p.images?.find((url) => !!url) || '/images/placeholder.jpg';

  return {
    image,
    category: p.brand || p.categorySlug,
    name: p.name,
    price: p.price.toFixed(2),
    // Changed from /products?slug=... to /products/...
    shopLink: `/products/${encodeURIComponent(p.slug)}`,
    alt: p.name,
  };
}