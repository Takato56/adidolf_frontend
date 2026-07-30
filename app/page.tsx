// FILE: takato56-adidolf_frontend/app/page.tsx

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { mockTrending } from "@/data/HomepageData";
import { useProducts } from "@/lib/hooks/useProducts";
import { toProductCardData } from "@/lib/adapters/productDisplay";
import { USE_MOCK_DATA } from "@/lib/config";

const SLIDES = [
  { id: 1, text: "Summer Collection 2026", sub: "Up to 50% Off" },
  { id: 2, text: "New Arrivals Just Dropped", sub: "Explore premium streetwear" },
  { id: 3, text: "The Essentials Pack", sub: "Meticulously crafted basics" },
];

// Ultra-fast, global Unsplash CDN fashion & streetwear images
const FAST_HERO_PHOTOS = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop",
];

const FAST_CATEGORY_PHOTOS: Record<string, string> = {
  lifestyle: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=800&auto=format&fit=crop",
  menswear: "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=800&auto=format&fit=crop",
  womenswear: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
};

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileTouchStartX = useRef<number>(0);
  const mobileTouchEndX = useRef<number>(0);

  const { products, isLoaded, error } = useProducts();

  // Shuffle hero banner images on mount for instant randomness
  const [slideImages, setSlideImages] = useState<Record<number, string>>({});

  useEffect(() => {
    const shuffled = [...FAST_HERO_PHOTOS].sort(() => 0.5 - Math.random());
    const chosen: Record<number, string> = {};

    SLIDES.forEach((slide, i) => {
      chosen[slide.id] = shuffled[i % shuffled.length];
    });

    setSlideImages(chosen);
  }, []);

  const trending = USE_MOCK_DATA
    ? mockTrending
    : products.filter((p) => p.isPublished).slice(0, 8).map(toProductCardData);

  // Shop by Categories tile images (use product image if available, else fast CDN fallback)
  const [categoryImages, setCategoryImages] = useState<Record<string, string | null>>({});

  useEffect(() => {
    if (!isLoaded) return;

    const pickRandom = <T,>(items: T[]): T | undefined =>
      items.length > 0 ? items[Math.floor(Math.random() * items.length)] : undefined;

    const slugs = ["lifestyle", "menswear", "womenswear"];
    const next: Record<string, string | null> = {};

    slugs.forEach((slug) => {
      const categoryProducts = products.filter(
        (p) => p.isPublished && p.categorySlug === slug && p.images?.some(Boolean)
      );
      const chosen = pickRandom(categoryProducts);
      const real = chosen ? pickRandom(chosen.images.filter(Boolean)) : undefined;
      next[slug] = real ?? FAST_CATEGORY_PHOTOS[slug] ?? FAST_HERO_PHOTOS[0];
    });

    setCategoryImages(next);
  }, [isLoaded, products]);

  const lifestyleImage = categoryImages["lifestyle"] ?? FAST_CATEGORY_PHOTOS.lifestyle;
  const menswearImage = categoryImages["menswear"] ?? FAST_CATEGORY_PHOTOS.menswear;
  const womenswearImage = categoryImages["womenswear"] ?? FAST_CATEGORY_PHOTOS.womenswear;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;

    if (diff > swipeThreshold) {
      nextSlide();
    } else if (diff < -swipeThreshold) {
      prevSlide();
    }
  };

  const nextMobile = () => {
    setMobileIndex((prev) => (prev === 2 ? 0 : prev + 1));
  };

  const prevMobile = () => {
    setMobileIndex((prev) => (prev === 0 ? 2 : prev - 1));
  };

  const handleMobileTouchStart = (e: React.TouchEvent) => {
    mobileTouchStartX.current = e.targetTouches[0].clientX;
    mobileTouchEndX.current = e.targetTouches[0].clientX;
  };

  const handleMobileTouchMove = (e: React.TouchEvent) => {
    mobileTouchEndX.current = e.targetTouches[0].clientX;
  };

  const handleMobileTouchEnd = () => {
    const diff = mobileTouchStartX.current - mobileTouchEndX.current;
    const swipeThreshold = 40;

    if (diff > swipeThreshold) {
      nextMobile();
    } else if (diff < -swipeThreshold) {
      prevMobile();
    }
  };

  return (
    <div>
      {/* Fast & Random Hero Banner */}
      <div
        className="relative mt-1 h-60 md:h-[480px] w-full overflow-hidden group bg-neutral-900"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {SLIDES.map((slide) => {
            const slideImg = slideImages[slide.id];
            return (
              <div
                key={slide.id}
                className="w-full h-full flex-shrink-0 relative overflow-hidden flex flex-col justify-center items-center text-white p-4 text-center"
              >
                {slideImg ? (
                  <img
                    src={slideImg}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-900" />
                )}
                <div className="absolute inset-0 bg-black/50" />
                <h1 className="relative z-10 text-2xl md:text-5xl font-extrabold uppercase tracking-wider mb-2 drop-shadow-md">
                  {slide.text}
                </h1>
                <p className="relative z-10 text-sm md:text-lg text-gray-200 font-medium drop-shadow">
                  {slide.sub}
                </p>
              </div>
            );
          })}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:flex cursor-pointer"
        >
          ❮
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:flex cursor-pointer"
        >
          ❯
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 transition-all rounded-full cursor-pointer ${
                currentIndex === index ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Shop By Categories */}
      <div className="mainmargindiv mt-6">
        <p className="texttitle">
          <b>Shop by Categories</b>
        </p>
        <p className="subtitle mt-1 flex justify-between">
          Explore our meticulously crafted collections
          <Link href="/categories">
            <u>
              <b>View All</b>
            </u>
          </Link>
        </p>
      </div>

      <div className="mainmargindiv mt-7 bg-blue-20">
        <div className="hidden md:flex flex-row w-full justify-center gap-5">
          <Link href="/shop?category=lifestyle" className="border rounded-lg md:w-5/6 aspect-video md:aspect-16/10 shadow-md relative overflow-hidden bg-neutral-100">
            {lifestyleImage && (
              <img src={lifestyleImage} alt="Lifestyle" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <span className="absolute bottom-3 left-3 z-10 font-semibold text-black bg-white/70 px-2 py-1 rounded text-sm">
              Lifestyle
            </span>
          </Link>
          <Link href="/shop?category=menswear" className="border rounded-lg md:w-5/6 aspect-video md:aspect-16/10 relative overflow-hidden bg-neutral-100">
            {menswearImage && (
              <img src={menswearImage} alt="Menswear" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <span className="absolute bottom-3 left-3 z-10 font-semibold text-black bg-white/70 px-2 py-1 rounded text-sm">
              Menswear
            </span>
          </Link>
          <Link href="/shop?category=womenswear" className="border rounded-lg md:w-5/6 aspect-video md:aspect-16/10 relative overflow-hidden bg-neutral-100">
            {womenswearImage && (
              <img src={womenswearImage} alt="Womenswear" className="absolute inset-0 w-full h-full object-cover" />
            )}
            <span className="absolute bottom-3 left-3 z-10 font-semibold text-black bg-white/70 px-2 py-1 rounded text-sm">
              Womenswear
            </span>
          </Link>
        </div>

        {/* Categories Mobile Slider */}
        <div className="md:hidden w-full overflow-hidden relative">
          <div
            className="flex w-full transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
            onTouchStart={handleMobileTouchStart}
            onTouchMove={handleMobileTouchMove}
            onTouchEnd={handleMobileTouchEnd}
          >
            <div className="w-full flex-shrink-0 px-1">
              <Link
                href="/shop?category=lifestyle"
                className="border rounded-lg aspect-video bg-neutral-800 flex items-center justify-center text-white relative overflow-hidden"
              >
                {lifestyleImage && (
                  <img src={lifestyleImage} alt="Lifestyle" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <span className="absolute bottom-3 left-3 z-10 font-semibold text-black bg-white/70 px-2 py-1 rounded text-sm">
                  Lifestyle
                </span>
              </Link>
            </div>
            <div className="w-full flex-shrink-0 px-1">
              <Link
                href="/shop?category=menswear"
                className="border rounded-lg aspect-video bg-neutral-700 flex items-center justify-center text-white relative overflow-hidden"
              >
                {menswearImage && (
                  <img src={menswearImage} alt="Menswear" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <span className="absolute bottom-3 left-3 z-10 font-semibold text-black bg-white/70 px-2 py-1 rounded text-sm">
                  Menswear
                </span>
              </Link>
            </div>
            <div className="w-full flex-shrink-0 px-1">
              <Link
                href="/shop?category=womenswear"
                className="border rounded-lg aspect-video bg-neutral-600 flex items-center justify-center text-white relative overflow-hidden"
              >
                {womenswearImage && (
                  <img src={womenswearImage} alt="Womenswear" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <span className="absolute bottom-3 left-3 z-10 font-semibold text-black bg-white/70 px-2 py-1 rounded text-sm">
                  Womenswear
                </span>
              </Link>
            </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-3">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setMobileIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  mobileIndex === index ? "w-4 bg-black" : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trending Now Title */}
      <div className="mainmargindiv mt-10">
        <p className="texttitle">
          <b>Trending Now</b>
        </p>
        <p className="subtitle mt-1">
          The most coveted pieces in our collection right now
        </p>
      </div>

      {/* Trending Now Section */}
      <div className="mainmargindiv mt-7">
        <div className="mt-3 font-sans">
          {!USE_MOCK_DATA && !isLoaded && (
            <p className="text-sm text-gray-400">Loading products...</p>
          )}
          {!USE_MOCK_DATA && isLoaded && error && (
            <p className="text-sm text-red-500">Couldn't load products: {error}</p>
          )}
          {!USE_MOCK_DATA && isLoaded && !error && trending.length === 0 && (
            <p className="text-sm text-gray-400">No products published yet.</p>
          )}
          <div className="flex overflow-x-auto gap-4 pb-4">
            {(USE_MOCK_DATA || isLoaded) &&
              trending.map((product, index) => (
                <div key={`trending-${index}`} className="shrink-0 w-[260px] sm:w-[320px] md:w-[370px]">
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
      <div className="h-10"></div>
    </div>
  );
}