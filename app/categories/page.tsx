'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingIcon from "@/components/LoadingIcon";
import { useProducts } from "@/lib/hooks/useProducts";

const CATEGORY_SLUGS = ["lifestyle", "menswear", "womenswear", "accessories", "footwear"];

// Hardcoded, not persisted anywhere (no localStorage involved), so it can't
// go stale like lib/hooks/useCategories.ts's localStorage-backed data did.
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  lifestyle: "https://loremflickr.com/640/480/lifestyle?lock=10",
  menswear: "https://loremflickr.com/640/480/menswear,fashion?lock=11",
  womenswear: "https://loremflickr.com/640/480/womenswear,fashion?lock=12",
  accessories: "https://loremflickr.com/640/480/accessories,fashion?lock=13",
  footwear: "https://loremflickr.com/640/480/shoes,footwear?lock=14",
};

export default function Categories() {
  const { products, isLoaded } = useProducts();
  const [categoryImages, setCategoryImages] = useState<Record<string, string | null>>({});

  // Computed client-side, after products have loaded, to avoid any
  // SSR/hydration timing race with Math.random().
  useEffect(() => {
    if (!isLoaded) return;

    const pickRandom = <T,>(items: T[]): T | undefined =>
      items.length > 0 ? items[Math.floor(Math.random() * items.length)] : undefined;

    const next: Record<string, string | null> = {};
    CATEGORY_SLUGS.forEach((slug) => {
      const categoryProducts = products.filter(
        (p) => p.isPublished && p.categorySlug === slug && p.images?.some(Boolean)
      );
      const chosen = pickRandom(categoryProducts);
      const real = chosen ? pickRandom(chosen.images.filter(Boolean)) : undefined;
      next[slug] = real ?? CATEGORY_FALLBACK_IMAGES[slug] ?? null;
    });

    setCategoryImages(next);
  }, [isLoaded, products]);

  const lifestyleImage = categoryImages["lifestyle"] ?? null;
  const menswearImage = categoryImages["menswear"] ?? null;
  const womenswearImage = categoryImages["womenswear"] ?? null;
  const accessoriesImage = categoryImages["accessories"] ?? null;
  const footwearImage = categoryImages["footwear"] ?? null;

  return (
    <div>
      <div className="margindiv mt-3">
        <nav>
          <ul className="breadcumb">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li className="text-gray-700 text-sm">&gt;</li>

            <li>
              <span className="text-black font-medium">Categories</span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="texttitle margindiv mt-6">
        <div className="pt-4">
          <p>Categories </p>
        </div>
        <div className="subtitle pt-1">
          Define Your Statement
        </div>
      </div>
      <div className="margindiv bg-[#f8f9ff] rounded-lg mt-6">
        <div className="mt-3 font-sans">
          <div className="grid grid-cols-2 justify-center md:grid-cols-4 gap-1 md:gap-1 md:auto-rows-fr">
            <Link
              href="/shop?category=lifestyle"
              className="col-span-2 md:col-span-3 row-span-2 md:row-span-1 md:aspect-24/9 aspect-video bg-gray-200 bg-opacity-40 p-6 text-white text-center rounded-lg flex items-center justify-center relative overflow-hidden"
            >
              {lifestyleImage ? (
                <img src={lifestyleImage} alt="Lifestyle" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <LoadingIcon size="sm" />
              )}
              <span className="absolute bottom-3 left-3 z-10 font-semibold text-black bg-white/70 px-2 py-1 rounded text-sm">
                Lifestyle
              </span>
            </Link>

            <Link
              href="/shop?category=menswear"
              className="aspect-8/9 md:aspect-auto bg-gray-200 bg-opacity-40 p-6 rounded-lg flex items-center justify-center relative overflow-hidden"
            >
              {menswearImage ? (
                <img src={menswearImage} alt="Menswear" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <LoadingIcon size="sm" />
              )}
              <span className="absolute bottom-3 left-3 z-10 font-semibold text-black bg-white/70 px-2 py-1 rounded text-sm">
                Menswear
              </span>
            </Link>

            <Link
              href="/shop?category=womenswear"
              className="md:col-span-2 col-span-1 row-span-1  md:aspect-auto bg-gray-200 bg-opacity-40 p-6 text-white text-center rounded-lg flex items-center justify-center relative overflow-hidden"
            >
              {womenswearImage ? (
                <img src={womenswearImage} alt="Womenswear" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <LoadingIcon size="sm" />
              )}
              <span className="absolute bottom-3 left-3 z-10 font-semibold text-black bg-white/70 px-2 py-1 rounded text-sm">
                Womenswear
              </span>
            </Link>

            <Link
              href="/shop?category=accessories"
              className="aspect-8/9 md:aspect-auto bg-gray-200 bg-opacity-40 p-6 rounded-lg flex items-center justify-center relative overflow-hidden"
            >
              {accessoriesImage ? (
                <img src={accessoriesImage} alt="Accessories" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <LoadingIcon size="sm" />
              )}
              <span className="absolute bottom-3 left-3 z-10 font-semibold text-black bg-white/70 px-2 py-1 rounded text-sm">
                Accessories
              </span>
            </Link>

            <Link
              href="/shop?category=footwear"
              className="aspect-8/9 md:aspect-auto bg-gray-200 bg-opacity-40 p-6 rounded-lg flex items-center justify-center relative overflow-hidden"
            >
              {footwearImage ? (
                <img src={footwearImage} alt="Footwear" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <LoadingIcon size="sm" />
              )}
              <span className="absolute bottom-3 left-3 z-10 font-semibold text-black bg-white/70 px-2 py-1 rounded text-sm">
                Footwear
              </span>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-8"></div>
    </div>
  );
}