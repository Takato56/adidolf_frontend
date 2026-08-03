"use client";
import { FaFilter, FaChevronDown } from "react-icons/fa"; // Thêm icon mũi tên để kiểm soát khoảng cách
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

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "lowtohigh", label: "Low to High" },
  { value: "hightolow", label: "High to Low" },
];

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

      {/* Main Layout Grid */}
      <div className="mt-4 md:flex md:gap-6 items-start">
        
        {/* DESKTOP SIDEBAR */}
        <div className="hidden md:block w-full md:w-1/4 lg:w-1/5 min-w-[240px] bg-white border border-gray-300 shadow-md rounded-lg p-5 h-fit">
          <div className="flex flex-col gap-6">
            
            {/* 1. Sort By (Đã thiết kế lại để căn chỉnh mũi tên đối xứng) */}
            <div>
              <p className="text-[20px] font-bold mb-2">Sort by</p>
              <div className="relative w-full">
                <select
                  id="sort-desktop"
                  name="sorttype"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full appearance-none text-[16px] font-medium bg-[#fafeff] border rounded-md py-2 pl-4 pr-10 text-gray-800 outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {/* Icon mũi tên custom thay thế cho mặc định, cách phải chính xác bằng khoảng cách text cách trái (right-4 tương đương pl-4) */}
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-600">
                  <FaChevronDown className="text-[12px]" />
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* 2. Price Range */}
            <div>
              <p className="mb-2 text-[20px] font-bold">Price Range</p>
              {renderPriceFilter("text-[16px]")}
            </div>

            {/* 3. Category */}
            <div>
              <p className="text-[20px] font-bold mb-3">Category</p>
              {renderCategoryFilter("text-[16px]")}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                  className="border rounded-md py-1 px-3 hover:bg-black hover:text-white transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit disabled:cursor-not-allowed text-[14px]"
                >
                  Clear Filters
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          
          {/* HEADER ROW */}
          <div className="flex flex-row justify-between items-start w-full">
            <div>
              <p className="texttitle">{title}</p>
              <p className="subtitle pt-1">{subtitle}</p>
            </div>

            {/* Nút Filter cho thiết bị Mobile */}
            <div className="block md:hidden pt-2">
              <button
                type="button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="rounded-md border px-3 py-1 shadow-md bg-[#fafeff] text-[14px] flex gap-2 font-semibold items-center"
              >
                <FaFilter className="text-[12px]" />
                Filters & Sort
              </button>
            </div>
          </div>

          {/* Mobile Filters & Sort Dropdown */}
          {isFilterOpen && (
            <div className="block md:hidden w-full subtitle bg-white border border-gray-300 rounded-lg mt-3 p-4 h-fit">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[16px] font-bold mb-2">Sort by</p>
                  <div className="relative w-full">
                    <select
                      id="sort-mobile"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full appearance-none text-[14px] bg-[#fafeff] border rounded-md py-1.5 pl-3 pr-8 outline-none"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-600">
                      <FaChevronDown className="text-[10px]" />
                    </div>
                  </div>
                </div>
                <hr />
                <div>
                  <p className="mb-2 text-[16px] font-bold">Price Range</p>
                  {renderPriceFilter("text-[12px]")}
                </div>
                <div>
                  <p className="text-[16px] font-bold mb-2">Category</p>
                  {renderCategoryFilter("text-[12px]", 6)}
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 w-full border rounded-md py-1 px-3 hover:bg-black hover:text-white transition-all text-[13px]"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Dynamic Product Grid */}
          <div className="mt-4">
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
      </div>

      <div className="mt-24"></div>
    </div>
  );
}