import { Product } from '@/types';

export interface ProductCardData {
  image: string;
  category: string;
  name: string;
  price: string;
  shopLink: string;
  alt?: string;
}

// app/products/page.tsx is the single dynamic "buying" page for every
// product; it reads ?slug= and fetches the matching product from the API.
export function toProductCardData(p: Product): ProductCardData {
  const image = p.images?.find((url) => !!url) || '/images/placeholder.jpg';

  return {
    image,
    category: p.brand || p.categorySlug,
    name: p.name,
    price: p.price.toFixed(2),
    shopLink: `/products?slug=${encodeURIComponent(p.slug)}`,
    alt: p.name,
  };
}