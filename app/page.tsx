"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { mockTrending } from "@/data/HomepageData"; // Import từ file data đã chia riêng

const SLIDES = [
  { id: 1, bg: "bg-neutral-900", text: "Summer Collection 2026", sub: "Up to 50% Off" },
  { id: 2, bg: "bg-zinc-800", text: "New Arrivals Just Dropped", sub: "Explore premium streetwear" },
  { id: 3, bg: "bg-stone-900", text: "The Essentials Pack", sub: "Meticulously crafted basics" },
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const [mobileIndex, setMobileIndex] = useState(0);
  const mobileTouchStartX = useRef<number>(0);
  const mobileTouchEndX = useRef<number>(0);

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
      {/* Slider Banner */}
      <div 
        className="relative mt-1 h-60 md:h-[480px] w-full overflow-hidden group"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {SLIDES.map((slide) => (
            <div
              key={slide.id}
              className={`w-full h-full flex-shrink-0 ${slide.bg} flex flex-col justify-center items-center text-white p-4 text-center`}
            >
              <h1 className="text-2xl md:text-5xl font-extrabold uppercase tracking-wider mb-2">
                {slide.text}
              </h1>
              <p className="text-sm md:text-lg text-gray-300">
                {slide.sub}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          ❮
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
        >
          ❯
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 transition-all rounded-full ${
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
          <Link href="/categories/lifestyle" className="border rounded-lg md:w-5/6 aspect-video md:aspect-16/10 shadow-md"></Link>
          <div className="border rounded-lg md:w-5/6 aspect-video md:aspect-16/10"> A</div>
          <div className="border rounded-lg md:w-5/6 aspect-video md:aspect-16/10"> A</div>
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
              <div className="border rounded-lg aspect-video bg-neutral-800 flex items-center justify-center text-white">
                Slide Mobile 1
              </div>
            </div>
            <div className="w-full flex-shrink-0 px-1">
              <div className="border rounded-lg aspect-video bg-neutral-700 flex items-center justify-center text-white">
                Slide Mobile 2
              </div>
            </div>
            <div className="w-full flex-shrink-0 px-1">
              <div className="border rounded-lg aspect-video bg-neutral-600 flex items-center justify-center text-white">
                Slide Mobile 3
              </div>
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
          <div className="flex overflow-x-auto gap-4 pb-4">
            {mockTrending.map((product, index) => (
              <ProductCard
                key={`trending-${index}`}
                image={product.image}
                alt={product.alt}
                category={product.category}
                name={product.name}
                price={product.price}
                shopLink={product.shopLink}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="h-10"></div>
    </div>
  );
}