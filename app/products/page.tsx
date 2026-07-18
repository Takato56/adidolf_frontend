'use client';

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import { getProductBySlug } from "@/lib/products";
import { useProducts } from "@/lib/hooks/useProducts";
import { toProductCardData } from "@/lib/adapters/productDisplay";
import { USE_MOCK_DATA } from "@/lib/config";
import { Product } from "@/types";

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 py-4">
      <button
        className="w-full flex justify-between items-center text-left font-bold text-gray-900 text-lg transition-colors hover:text-orange-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <FiMinus className="text-xl" /> : <FiPlus className="text-xl" />}
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden text-sm text-gray-600 leading-relaxed space-y-1.5">
          {children}
        </div>
      </div>
    </div>
  );
}

// Mock fallback shown when USE_MOCK_DATA is on, or nothing else is available.
const MOCK_PRODUCT_IMAGES = [
  "https://i.pinimg.com/736x/8c/ab/89/8cab892d5b35bee91018ed6744e53679.jpg",
  "https://i.pinimg.com/736x/c0/81/13/c08113b8df8e619f39049291f312504f.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReJxXMq73kmIUEGUAKiLTKZwdnJHBL2fLCOcuusuFmZ84gmgQLFBYgnYrf&s=10",
  "https://tse2.mm.bing.net/th/id/OIP.PgWL-_pupZaymNTXBHQzOQHaIV?rs=1&pid=ImgDetMain&o=7&rm=3",
];

function ProductPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA && !!slug);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (USE_MOCK_DATA || !slug) return;

    let cancelled = false;
    setIsLoading(true);
    setFetchError(null);

    getProductBySlug(slug)
      .then((p) => {
        if (!cancelled) setProduct(p);
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(err instanceof Error ? err.message : "Failed to load product");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // "Recommended" strip, real published catalogue minus the current product.
  const { products: allProducts } = useProducts();
  const recommended = allProducts
    .filter((p) => p.isPublished && p.slug !== slug)
    .slice(0, 8)
    .map(toProductCardData);

  const images = USE_MOCK_DATA || !product
    ? MOCK_PRODUCT_IMAGES
    : (product.images.filter(Boolean).length > 0 ? product.images.filter(Boolean) : MOCK_PRODUCT_IMAGES);

  const displayName = USE_MOCK_DATA || !product ? "McLaren Racing Suit 2025" : product.name;
  const displayBrand = USE_MOCK_DATA || !product ? "McLaren" : product.brand;
  const displayPrice = USE_MOCK_DATA || !product ? "500.00" : product.price.toFixed(2);
  const displayDescription =
    USE_MOCK_DATA || !product
      ? "Premium professional McLaren racing suit 2025 edition designed for F1 drivers."
      : product.description;

  const sizes = USE_MOCK_DATA || !product
    ? ["S", "XS", "M", "L", "XL", "2XL", "3XL"]
    : Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean))) as string[];

  const colors = USE_MOCK_DATA || !product
    ? ["#ff0000", "#0000ff", "#000000", "#ffffff", "#008000", "#ffff00"]
    : Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean))) as string[];

  const [currentActiveIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Reset the image carousel whenever a different product loads.
  useEffect(() => {
    setActiveIndex(0);
  }, [product?.id]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      if (currentActiveIndex < images.length - 1) {
        setActiveIndex(currentActiveIndex + 1);
      }
    }
    if (touchStartX.current - touchEndX.current < -50) {
      if (currentActiveIndex > 0) {
        setActiveIndex(currentActiveIndex - 1);
      }
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const { scrollLeft } = sliderRef.current;
      const firstChild = sliderRef.current.firstElementChild as HTMLElement;

      if (firstChild) {
        const cardWidth = firstChild.getBoundingClientRect().width;
        const gap = parseFloat(window.getComputedStyle(sliderRef.current).gap) || 0;
        const itemStep = cardWidth + gap;

        const isMobile = window.innerWidth < 768;
        const itemsToScroll = isMobile ? 1 : 2;

        const scrollAmount = direction === "left" ? -(itemStep * itemsToScroll) : (itemStep * itemsToScroll);

        sliderRef.current.scrollTo({
          left: scrollLeft + scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  if (!USE_MOCK_DATA && slug && isLoading) {
    return (
      <div className="mx-auto px-4 md:px-50 py-24 text-center text-gray-400">
        Loading product...
      </div>
    );
  }

  if (!USE_MOCK_DATA && slug && fetchError) {
    return (
      <div className="mx-auto px-4 md:px-50 py-24 text-center">
        <p className="text-red-500">Couldn't load this product: {fetchError}</p>
        <Link href="/shop" className="text-blue-600 underline mt-2 inline-block">
          Back to shop
        </Link>
      </div>
    );
  }

  if (!USE_MOCK_DATA && !slug) {
    return (
      <div className="mx-auto px-4 md:px-50 py-24 text-center">
        <p className="text-gray-500">No product selected.</p>
        <Link href="/shop" className="text-blue-600 underline mt-2 inline-block">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 md:px-50">

      <div className="mt-3">
        <nav className="hidden md:block">
          <ul className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:underline text-gray-600"> Home </Link>
            </li>
            <li className="text-gray-400">&gt;</li>
            <li>
              <Link href="/shop" className="hover:underline text-gray-600"> Products </Link>
            </li>
            <li className="text-gray-400">&gt;</li>
            <li>
              <span className="text-black font-medium">{displayName}</span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mt-10 flex flex-col lg:flex-row gap-10 items-start">

        <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-4 items-stretch md:sticky md:top-6">
          <div
            className="flex-1 aspect-3/4 overflow-hidden rounded-lg bg-gray-100 relative touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentActiveIndex * 100}%)` }}
            >
              {images.map((src, index) => (
                <div key={index} className="w-full h-full shrink-0">
                  <img
                    src={src}
                    className="w-full h-full object-cover object-center select-none"
                    alt="Product Image"
                  />
                </div>
              ))}
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${currentActiveIndex === index ? 'w-4 bg-black' : 'w-1.5 bg-gray-400'}`}
                />
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-2 w-[80px] md:w-[100px] shrink-0">
            {images.map((src, index) => (
              <div
                key={index}
                className={`flex-1 min-h-0 overflow-hidden rounded-lg bg-gray-100 cursor-pointer border-2 transition-all ${
                  currentActiveIndex === index ? 'border-black' : 'border-transparent hover:border-gray-400'
                }`}
                onClick={() => setActiveIndex(index)}
              >
                <img
                  src={src}
                  className="w-full h-full object-cover object-center"
                  alt={`Sub Image ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2 shadow-md bg-[#f6f6f6] py-6 px-6 md:px-10 font-sans rounded-2xl border border-gray-100">
          <p className="text-[25px] pt-3 md:pt-0 md:text-[30px] font-bold text-gray-900">{displayName}</p>

          {displayBrand && (
            <div className="mt-2">
              <span className="inline-block rounded-3xl font-semibold border border-gray-200 px-3 py-0.5 text-[13px] bg-[#FF8000] text-white">
                {displayBrand}
              </span>
            </div>
          )}

          <p className="pt-3 md:pt-5 text-[30px] md:text-[35px] font-bold text-red-600">${displayPrice}</p>

          <div>
            {sizes.length > 0 && (
              <div className="flex flex-row flex-wrap gap-2 mt-6">
                <p className="my-auto font-semibold pr-4 text-gray-700">Size:</p>
                {sizes.map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white has-checked:bg-black has-checked:text-white has-checked:border-black select-none transition-all">
                    <input type="radio" name="product-size" value={item} className="hidden" />
                    <span className="text-[14px] md:text-[16px]">{item}</span>
                  </label>
                ))}
              </div>
            )}

            {colors.length > 0 && (
              <div className="flex flex-row flex-wrap gap-3 mt-6">
                <p className="my-auto font-semibold pr-4 text-gray-700">Color:</p>
                {colors.map((item) => (
                  <label
                    key={item}
                    className="cursor-pointer relative w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-200 hover:scale-110 has-[:checked]:ring-2 has-[:checked]:ring-black has-[:checked]:ring-offset-2 select-none"
                    style={{ backgroundColor: item.startsWith('#') ? item : undefined }}
                    title={item}
                  >
                    <input type="radio" name="product-color" value={item} className="hidden" />
                    {!item.startsWith('#') && (
                      <span className="text-[10px] text-gray-700">{item}</span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-row gap-3 mt-8 mb-8">
            <button
              id="favor"
              className="border border-gray-300 flex rounded-lg w-[15%] py-3 justify-center items-center bg-white text-xl transition-colors"
              onClick={() => {
                const element = document.getElementById("favor");
                if (element) {
                  if (element.style.backgroundColor === "red") {
                    element.style.backgroundColor = "white";
                    element.style.color = "black";
                  } else {
                    element.style.backgroundColor = "red";
                    element.style.color = "white";
                  }
                }
              }}
            >
              <FiHeart />
            </button>

            <button className="border border-transparent flex flex-row rounded-lg w-[85%] py-3 justify-center items-center bg-black text-white font-medium hover:bg-gray-800 transition-colors">
              <FiShoppingCart className="mr-2" />
              Add to cart
            </button>
          </div>

          <div className="mt-6 border-t border-gray-300">
            <AccordionItem title="Description">
              <p>{displayDescription || 'No description available.'}</p>
            </AccordionItem>

            <AccordionItem title="Product care instructions">
              <p>– Machine wash or hand wash on a medium cycle with a short spin, do not soak.</p>
              <p>– Wash at a maximum temperature of 30°C to protect technical fibers.</p>
              <p>– Do not tumble dry in commercial dryer machines.</p>
              <p>– Iron at medium temperature if necessary.</p>
            </AccordionItem>

            <AccordionItem title="Delivery / Returns">
              <p>– <strong>Delivery option:</strong> Nationwide express shipping or secured standard shipping available.</p>
              <p>– <strong>Exchange policy:</strong> Size exchanges are supported within 30 days for full-priced items (requires original tags, packaging, and original unused condition).</p>
              <p>– Return policy does not apply to items from deep clearance or promotional sales.</p>
            </AccordionItem>
          </div>
        </div>

      </div>

      {recommended.length > 0 && (
        <div className="mt-16 pt-3 px-3 pb-5 rounded-2xl relative group">
          <div className="flex justify-between items-center mb-6">
            <div className="text-[18px] md:text-[22px]">
              <b className="font-sans text-gray-900">Recommended</b>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                aria-label="Previous products"
              >
                <FiChevronLeft className="text-xl" />
              </button>

              <button
                onClick={() => scroll("right")}
                className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                aria-label="Next products"
              >
                <FiChevronRight className="text-xl" />
              </button>
            </div>
          </div>

          <div className="font-sans relative">
            <div
              ref={sliderRef}
              className="overflow-x-hidden gap-3 md:gap-6 pb-4 flex justify-start scroll-smooth scrollbar-none w-full snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {recommended.map((p, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[calc(50%-10px)] md:w-[calc(25%-18px)] snap-start"
                >
                  <ProductCard
                    image={p.image}
                    alt={p.alt}
                    category={p.category}
                    name={p.name}
                    price={p.price}
                    shopLink={p.shopLink}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-10"></div>
    </div>
  );
}

// useSearchParams() requires a Suspense boundary in the App Router, or
// `next build` fails during static generation.
export default function ProductPage() {
  return (
    <Suspense fallback={null}>
      <ProductPageContent />
    </Suspense>
  );
}