"use client";
import { FaFilter } from "react-icons/fa";
import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { toProductCardData } from "@/lib/adapters/productDisplay";
import { Product } from "@/types";

const PRICE_BUCKETS = [
  { label: "Under $25", test: (price: number) => price < 25 },
  { label: "$25 - $50", test: (price: number) => price >= 25 && price < 50 },
  { label: "$50 - $100", test: (price: number) => price >= 50 && price < 100 },
  { label: "$100 - $200", test: (price: number) => price >= 100 && price < 200 },
  { label: "$200 & Above", test: (price: number) => price >= 200 },
];

const CATEGORY_NAMES: Record<string, string> = {
  lifestyle: "Lifestyle",
  menswear: "Menswear",
  womenswear: "Womenswear",
  accessories: "Accessories",
  footwear: "Footwear",
};

const toTitleCase = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const toggleInArray = (arr: string[], value: string) =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

interface ProductViewProps {
  categorySlug: string;
  title: string;
  subtitle: string;
  products: Product[];
  isLoading?: boolean;
  initialCategoryFilter?: string | null;
}

export default function ProductView({
  categorySlug,
  title,
  subtitle,
  products = [],
  isLoading = false,
  initialCategoryFilter = null,
}: ProductViewProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategoryFilter ? [initialCategoryFilter] : []
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState("newest");

  // Filter option lists, derived from the actual products passed in — only
  // options that would actually return at least one result are shown.
  const availablePriceBuckets = useMemo(
    () => PRICE_BUCKETS.filter((bucket) => products.some((p) => bucket.test(p.price))),
    [products]
  );

  const availableCategories = useMemo(() => {
    const slugs = Array.from(new Set(products.map((p) => p.categorySlug).filter(Boolean)));
    return slugs.map((slug) => ({
      slug,
      name: CATEGORY_NAMES[slug] ?? toTitleCase(slug),
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const priceMatchers = PRICE_BUCKETS.filter((b) => selectedPriceRanges.includes(b.label));

    let result = products
      .filter((p) => selectedCategories.length === 0 || selectedCategories.includes(p.categorySlug))
      .filter(
        (p) => priceMatchers.length === 0 || priceMatchers.some((bucket) => bucket.test(p.price))
      );

    if (sortOption === "lowtohigh") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortOption === "hightolow") {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    // "newest" relies on the order already returned by the API (created_at desc).

    return result;
  }, [products, selectedCategories, selectedPriceRanges, sortOption]);

  const displayProducts = filteredProducts.map(toProductCardData);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedPriceRanges.length > 0;

  const renderPriceFilter = (labelSize: string) => (
    <div className="flex flex-row flex-wrap gap-2">
      {availablePriceBuckets.map((bucket) => (
        <label
          key={bucket.label}
          className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg p-2 text-[14px] text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none"
        >
          <input
            type="checkbox"
            name="priceRange"
            value={bucket.label}
            className="hidden"
            checked={selectedPriceRanges.includes(bucket.label)}
            onChange={() => setSelectedPriceRanges((prev) => toggleInArray(prev, bucket.label))}
          />
          <span className={labelSize}>{bucket.label}</span>
        </label>
      ))}
    </div>
  );

  const renderCategoryFilter = (labelSize: string, limit?: number) => (
    <div className="flex flex-row flex-wrap gap-2">
      {(limit ? availableCategories.slice(0, limit) : availableCategories).map((category) => (
        <label
          key={category.slug}
          className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none"
        >
          <input
            type="checkbox"
            name="category"
            value={category.slug}
            className="hidden"
            checked={selectedCategories.includes(category.slug)}
            onChange={() => setSelectedCategories((prev) => toggleInArray(prev, category.slug))}
          />
          <span className={labelSize}>{category.name}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="margindiv font-sans">
      {/* Breadcrumbs */}
      <div className="mt-3">
        <nav className="hidden md:block">
          <ul className="breadcumb">
            <li>
              <Link href="/" className="hover:underline">Home</Link>
            </li>
            <li className="text-gray-700 text-sm">&gt;</li>
            <li>
              <Link href="/categories" className="hover:underline">Categories</Link>
            </li>
            <li className="text-gray-700 text-sm">&gt;</li>
            <li>
              <span className="text-black font-medium capitalize">{title}</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Dynamic Title */}
      <div>
        <p className="texttitle pt-4">{title}</p>
        <p className="subtitle pt-1">{subtitle}</p>
      </div>

      {/* Control Bar */}
      <div className="pt-15 flex justify-between md:justify-end">
        <button
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="block md:hidden rounded-md border px-2 md:px-4 shadow-md bg-[#fafeff] text-[12px] md:text-[16px] flex py-1 gap-1 font-semibold"
        >
          <div className="my-1 pointer-events-none">
            <FaFilter />
          </div>
          Filters
        </button>

        <div>
          <label htmlFor="sort" className="text-[15px] md:text-[19px]">Sort by:</label>
          <select
            id="sort"
            name="sorttype"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="text-[14px] md:text-[18px] ml-2 font-bold bg-[#fafeff] border rounded-sm"
          >
            <option value="newest">Newest first</option>
            <option value="lowtohigh">Low to High</option>
            <option value="hightolow">High to Low</option>
          </select>
        </div>
      </div>

      {/* Mobile Filters */}
      {isFilterOpen && (
        <div className="block md:hidden w-full subtitle bg-white border border-gray-300 rounded-lg mt-1 p-3 h-fit">
          <div className="grid grid-cols-2 justify-center gap-1">
            <div>
              <p className="mb-2 text-[16px]">Price Range</p>
              {renderPriceFilter("text-[12px]")}
            </div>
            <div className="w-full mt-3">
              <p className="text-[16px] mb-2">Category</p>
              {renderCategoryFilter("text-[12px]", 6)}
            </div>
          </div>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-3 border rounded-md py-1 px-3 hover:bg-black hover:text-white transition-all text-[13px]"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Main Content Layout */}
      <div className="rounded-lg flex flex-row items-start">
        {/* Desktop Filters Sidebar */}
        <div className="w-full md:w-1/4 lg:w-1/5 bg-white border shadow-md min-w-[240px] border-gray-300 h-fit rounded-lg p-5 mt-4 transition-all hidden md:block">
          <div className="grid grid-rows-1 justify-center gap-8">
            <div>
              <p className="mb-2 text-[20px] font-bold">Price Range</p>
              {renderPriceFilter("text-[16px]")}
            </div>

            <div className="w-full">
              <p className="text-[20px] font-bold mb-3">Category</p>
              {renderCategoryFilter("text-[16px]")}
              <div className="pt-8">
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="border flex rounded-md py-1 px-3 ml-auto hover:bg-black hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:cursor-not-allowed"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Product Grid */}
        <div className="mt-4 md:ml-6 flex-1">
          {isLoading && (
            <p className="text-sm text-gray-400">Loading products...</p>
          )}
          {!isLoading && displayProducts.length === 0 && (
            <p className="text-sm text-gray-400">
              {products.length === 0
                ? "No products in this category yet."
                : "No products match the selected filters."}
            </p>
          )}
          <div className="gap-3 md:gap-4 grid grid-cols-2 w-full md:grid-cols-3 lg:grid-cols-4">
            {!isLoading &&
              displayProducts.map((product, index) => (
                <ProductCard
                  key={`${categorySlug}-prod-${index}`}
                  image={product.image}
                  alt={product.alt || product.name}
                  category={product.category}
                  name={product.name}
                  price={product.price}
                  shopLink={product.shopLink}
                />
              ))}
          </div>
        </div>
      </div>
      <div className="mt-24"></div>
    </div>
  );
}