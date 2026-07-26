'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingIcon from "@/components/LoadingIcon";
import { useProducts } from "@/lib/hooks/useProducts";
import { getCategoriesForFrontend } from "@/lib/categories";
import { isTestEntry } from "@/lib/utils/testData";

const pickRandom = <T,>(items: T[]): T | undefined =>
  items.length > 0 ? items[Math.floor(Math.random() * items.length)] : undefined;

interface CategoryTile {
  slug: string;
  name: string;
  imageUrl: string;
}

export default function Categories() {
  const { products, isLoaded: productsLoaded } = useProducts();

  const [categories, setCategories] = useState<CategoryTile[]>([]);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tileImages, setTileImages] = useState<Record<string, string>>({});

  // Pull the real category list from the backend — whatever exists there is
  // what renders here, however many there are.
  useEffect(() => {
    getCategoriesForFrontend()
      .then((data) => {
        setCategories(
          data
            .filter((c) => !isTestEntry(c.name) && !isTestEntry(c.slug))
            .map((c) => ({ slug: c.slug, name: c.name, imageUrl: c.imageUrl }))
        );
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load categories"))
      .finally(() => setCategoriesLoaded(true));
  }, []);

  // For each category, pick a random image from a random published product
  // in it. Falls back to the category's own imageUrl (set in the admin
  // panel), and finally to a themed LoremFlickr placeholder if neither
  // exists, so a tile is never blank.
  useEffect(() => {
    if (!categoriesLoaded || !productsLoaded) return;

    const next: Record<string, string> = {};
    categories.forEach((category) => {
      const categoryProducts = products.filter(
        (p) => p.isPublished && p.categorySlug === category.slug && p.images?.some(Boolean)
      );
      const chosenProduct = pickRandom(categoryProducts);
      const realImage = chosenProduct ? pickRandom(chosenProduct.images.filter(Boolean)) : undefined;

      next[category.slug] =
        realImage ||
        category.imageUrl ||
        `https://loremflickr.com/640/480/${encodeURIComponent(category.slug)},fashion?lock=${category.slug
          .split("")
          .reduce((sum, ch) => sum + ch.charCodeAt(0), 0)}`;
    });
    setTileImages(next);
  }, [categoriesLoaded, productsLoaded, categories, products]);

  const isLoaded = categoriesLoaded && productsLoaded;

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
          {!isLoaded && (
            <p className="text-sm text-gray-400 py-10 text-center">Loading categories...</p>
          )}
          {isLoaded && error && (
            <p className="text-sm text-red-500 py-10 text-center">Couldn't load categories: {error}</p>
          )}
          {isLoaded && !error && categories.length === 0 && (
            <p className="text-sm text-gray-400 py-10 text-center">No categories yet.</p>
          )}
          {isLoaded && !error && categories.length > 0 && (
            <>
              {(() => {
                // The hero spot rotates daily (same trick as the homepage
                // banner) instead of always being the same category, so it
                // stays deterministic for everyone visiting that day but
                // isn't stuck on one category forever.
                const daySeed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ""));
                const heroIndex = daySeed % categories.length;
                const hero = categories[heroIndex];
                const rest = categories.filter((_, i) => i !== heroIndex);

                return (
                  <>
                    <Link
                      href={`/shop?category=${encodeURIComponent(hero.slug)}`}
                      className="group block relative overflow-hidden rounded-2xl aspect-21/9 md:aspect-[3/1] mb-4 md:mb-5 shadow-sm hover:shadow-lg transition-shadow"
                    >
                      {tileImages[hero.slug] ? (
                        <img
                          src={tileImages[hero.slug]}
                          alt={hero.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <LoadingIcon size="sm" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12">
                        <span className="text-white/70 text-xs md:text-sm uppercase tracking-widest font-medium mb-1">
                          Featured category
                        </span>
                        <span className="text-white text-2xl md:text-4xl font-extrabold">
                          {hero.name}
                        </span>
                        <span className="mt-3 inline-flex w-fit items-center gap-1.5 text-white text-sm font-semibold border-b border-white/70 pb-0.5 group-hover:gap-2.5 transition-all">
                          Shop now →
                        </span>
                      </div>
                    </Link>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                      {rest.map((category) => (
                        <Link
                          key={category.slug}
                          href={`/shop?category=${encodeURIComponent(category.slug)}`}
                          className="group aspect-4/5 bg-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                          {tileImages[category.slug] ? (
                            <img
                              src={tileImages[category.slug]}
                              alt={category.name}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <LoadingIcon size="sm" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />
                          <span className="absolute bottom-4 left-4 z-10 font-semibold text-white text-base md:text-lg">
                            {category.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </div>
      </div>
      <div className="mt-8"></div>
    </div>
  );
}