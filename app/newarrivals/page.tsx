"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { mockDeals, mockNewArrivals } from "@/data/NewArrivalData";
import { useProducts } from "@/lib/hooks/useProducts";
import { toProductCardData } from "@/lib/adapters/productDisplay";
import { USE_MOCK_DATA } from "@/lib/config";

export default function NewArrivals() {
  // The backend doesn't have a "deal" or "new arrival" flag yet, so when
  // using real data we just split the published catalogue into two groups:
  // most recently created (new arrivals) and everything else (deals).
  const { products, isLoaded, error } = useProducts();
  const published = products.filter((p) => p.isPublished);
  const deals = USE_MOCK_DATA
    ? mockDeals
    : published.slice(0, 4).map(toProductCardData);
  const newArrivals = USE_MOCK_DATA
    ? mockNewArrivals
    : published.slice(4, 8).map(toProductCardData);

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="margindiv mt-3">
        <nav className="hidden md:block">
          <ul className="breadcumb">
            <li>
              <Link href="/" className="hover:font-bold hover:underline">
                Home
              </Link>
            </li>
            <li className="text-gray-700 text-sm">&gt;</li>
            <li>
              <span className="text-black font-medium">News</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Title */}
      <div className="margindiv mt-6">
        <p className="pt-4 texttitle">New Arrivals & Exclusive Deals</p>
        <p className="pt-1 subtitle">Discover our latest collection</p>
      </div>

      {!USE_MOCK_DATA && !isLoaded && (
        <div className="margindiv mt-6">
          <p className="text-sm text-gray-400">Loading products...</p>
        </div>
      )}
      {!USE_MOCK_DATA && isLoaded && error && (
        <div className="margindiv mt-6">
          <p className="text-sm text-red-500">Couldn't load products: {error}</p>
        </div>
      )}

      {/* Deals of the week Section */}
      <div className="margindiv mt-6 bg-[#E6F2FF] pt-3 pb-5 rounded-2xl">
        <div className="mx-6 text-[18px] md:text-[22px]">
          <b className="font-sans">Deals of the week</b>
        </div>
        <div className="mx-6 mt-3 font-sans">
          <div className="flex overflow-x-auto gap-4 pb-4">
            {(USE_MOCK_DATA || isLoaded) &&
              deals.map((product, index) => (
                <div key={`deal-${index}`} className="shrink-0 w-[260px] sm:w-[320px] md:w-[370px]">
                  <ProductCard
                    image={product.image}
                    alt={product.alt}
                    category={product.category}
                    name={product.name}
                    price={product.price}
                    shopLink={product.shopLink}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="margindiv p-3 md:p-6 rounded-lg">
        <p className="text-[18px] md:text-[22px] font-bold">New Arrivals</p>
        <div className="mt-3 font-sans">
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            {(USE_MOCK_DATA || isLoaded) &&
              newArrivals.map((product, index) => (
                <div key={`new-${index}`} className="shrink-0 w-[260px] sm:w-[320px] md:w-[370px]">
                  <ProductCard
                    image={product.image}
                    alt={product.alt}
                    category={product.category}
                    name={product.name}
                    price={product.price}
                    shopLink={product.shopLink}
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}