'use client';

import { useSearchParams } from "next/navigation";
import ProductView from "@/components/ProductView";
import { useProducts } from "@/lib/hooks/useProducts";

// Single dynamic listing page for every category. Which products show up is
// driven by the `category` query param (?category=<slug>) as the *initial*
// sidebar filter selection — from there, all filtering (category, price,
// size) happens inside ProductView against the real product data.
export default function ShopPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const search = searchParams.get("search");

  const { products, isLoaded } = useProducts();

  const published = products
    .filter((p) => p.isPublished)
    .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const title = categorySlug
    ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
    : "All Products";
  const subtitle = search
    ? `Results for "${search}"`
    : "Explore our full collection";

  return (
    <ProductView
      categorySlug={categorySlug ?? "all"}
      title={title}
      subtitle={subtitle}
      products={published}
      isLoading={!isLoaded}
      initialCategoryFilter={categorySlug}
    />
  );
}