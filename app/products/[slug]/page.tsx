// FILE: takato56-adidolf_frontend/app/products/[slug]/page.tsx

'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  FiShoppingCart,
  FiMinus,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiX,
  FiMaximize2,
} from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import { getProductBySlug } from "@/lib/products";
import { useProducts } from "@/lib/hooks/useProducts";
import { useCart } from "@/lib/hooks/useCart";
import { toProductCardData } from "@/lib/adapters/productDisplay";
import { USE_MOCK_DATA } from "@/lib/config";
import { Product, ProductVariant } from "@/types";

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 py-4">
      <button
        type="button"
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

const MOCK_PRODUCT_IMAGES = [
  "https://i.pinimg.com/736x/8c/ab/89/8cab892d5b35bee91018ed6744e53679.jpg",
  "https://i.pinimg.com/736x/c0/81/13/c08113b8df8e619f39049291f312504f.jpg",
];

export default function ProductDetailPage() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(!USE_MOCK_DATA && !!slug);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [currentActiveIndex, setActiveIndex] = useState(0);
  const [zoomedImageIndex, setZoomedImageIndex] = useState<number | null>(null);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const { addItem, voucher, discountAmount, subtotal: cartSubtotal } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [addToCartError, setAddToCartError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (USE_MOCK_DATA || !slug) return;

    let cancelled = false;
    setIsLoading(true);
    setFetchError(null);

    getProductBySlug(decodeURIComponent(slug))
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

  useEffect(() => {
    if (product?.variants?.length) {
      const inStockVariant = product.variants.find((v) => v.stock > 0) || product.variants[0];
      setSelectedVariant(inStockVariant);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomedImageIndex(null);
    };

    if (zoomedImageIndex !== null) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [zoomedImageIndex]);

  const unitPrice =
    USE_MOCK_DATA || !product
      ? parseFloat(displayPrice)
      : product.price + (selectedVariant?.extra_price ?? 0);

  const handleAddToCart = async () => {
    setAddedToCart(false);

    if (product && product.variants.length > 0 && !selectedVariant) {
      setAddToCartError("Please select a product variant.");
      return;
    }

    if (selectedVariant && selectedVariant.stock <= 0) {
      setAddToCartError("This variant is currently out of stock.");
      return;
    }

    setAddToCartError(null);
    setIsAdding(true);

    try {
      await addItem({
        productId: product ? product.id : "1",
        variantId: selectedVariant?.id,
        slug: product ? product.slug : "mock-product",
        name: displayName,
        image: selectedVariant?.image_url || images[0] || "",
        unitPrice,
        quantity: 1,
        size: selectedVariant?.size,
        color: selectedVariant?.color,
        stock: selectedVariant?.stock,
      });
      setAddedToCart(true);
    } catch (err) {
      setAddToCartError(err instanceof Error ? err.message : "Failed to add item to cart.");
    } finally {
      setIsAdding(false);
    }
  };

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
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      if (currentActiveIndex < images.length - 1) {
        setActiveIndex(currentActiveIndex + 1);
      }
    } else if (diff < -50) {
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

  return (
    <div className="mx-auto px-4 md:px-50">
      {/* Lightbox Modal */}
      {zoomedImageIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomedImageIndex(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setZoomedImageIndex(null);
            }}
            className="absolute top-5 right-5 text-white/80 hover:text-white bg-black/50 p-3 rounded-full backdrop-blur-sm z-10 transition cursor-pointer"
            aria-label="Close zoomed view"
          >
            <FiX className="text-2xl" />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomedImageIndex((prev) =>
                  prev === null ? 0 : prev === 0 ? images.length - 1 : prev - 1
                );
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/50 p-3 rounded-full backdrop-blur-sm z-10 transition cursor-pointer"
            >
              <FiChevronLeft className="text-2xl" />
            </button>
          )}

          <div
            className="relative max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[zoomedImageIndex]}
              alt="Zoomed product view"
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-transform duration-300"
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setZoomedImageIndex((prev) =>
                  prev === null ? 0 : (prev + 1) % images.length
                );
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/50 p-3 rounded-full backdrop-blur-sm z-10 transition cursor-pointer"
            >
              <FiChevronRight className="text-2xl" />
            </button>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white/90 text-xs px-3.5 py-1.5 rounded-full backdrop-blur-sm font-semibold tracking-wide">
              {zoomedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}

      {/* Breadcrumbs */}
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
        {/* Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-4 items-stretch md:sticky md:top-6">
          <div
            className="flex-1 aspect-3/4 overflow-hidden rounded-xl bg-gray-100 relative touch-pan-y cursor-zoom-in group"
            onClick={() => setZoomedImageIndex(currentActiveIndex)}
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
                    alt="Product View"
                  />
                </div>
              ))}
            </div>

            <div className="absolute top-3 right-3 bg-black/40 text-white p-2 rounded-full backdrop-blur-sm opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
              <FiMaximize2 className="text-sm" />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    currentActiveIndex === index ? 'w-4 bg-black' : 'w-1.5 bg-gray-400'
                  }`}
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
                  alt={`Thumbnail ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="w-full lg:w-1/2 shadow-md bg-[#f6f6f6] py-6 px-6 md:px-10 font-sans rounded-2xl border border-gray-100">
          <p className="text-[25px] pt-3 md:pt-0 md:text-[30px] font-bold text-gray-900">{displayName}</p>

          {displayBrand && (
            <div className="mt-2">
              <span className="inline-block rounded-3xl font-semibold border border-gray-200 px-3 py-0.5 text-[13px] bg-[#FF8000] text-white">
                {displayBrand}
              </span>
            </div>
          )}

          <p className="pt-3 md:pt-5 text-[30px] md:text-[35px] font-bold text-red-600">${unitPrice.toFixed(2)}</p>

          {voucher && discountAmount > 0 && (
            <p className="text-sm text-green-700 mt-1">
              Voucher <span className="font-mono font-semibold">{voucher.code}</span> applied
              (−${discountAmount.toFixed(2)} on ${cartSubtotal.toFixed(2)} subtotal).{" "}
              <Link href="/cart" className="underline">View cart</Link>
            </p>
          )}

          {/* Variant Selector */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                Select Option / Variant
              </label>
              {selectedVariant && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    selectedVariant.stock > 5
                      ? "bg-green-100 text-green-800"
                      : selectedVariant.stock > 0
                      ? "bg-amber-100 text-amber-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedVariant.stock > 0
                    ? `${selectedVariant.stock} available`
                    : "Out of Stock"}
                </span>
              )}
            </div>

            {product?.variants && product.variants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const labelParts = [v.color, v.size].filter(Boolean);
                  const titleLabel = labelParts.length > 0 ? labelParts.join(" / ") : v.sku || "Standard";

                  return (
                    <button
                      key={v.id || v.sku}
                      type="button"
                      onClick={() => {
                        setSelectedVariant(v);
                        setAddToCartError(null);
                        setAddedToCart(false);
                      }}
                      className={`relative flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-black bg-white shadow-sm ring-1 ring-black"
                          : "border-gray-200 bg-white/70 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {v.image_url ? (
                          <img
                            src={v.image_url}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-bold">
                            {v.size || 'V'}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm text-gray-900">{titleLabel}</p>
                          {v.extra_price > 0 && (
                            <p className="text-xs text-blue-600 font-medium">
                              +${v.extra_price.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-xs">
                          <FiCheck />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Standard edition</p>
            )}
          </div>

          {addToCartError && (
            <p className="text-sm text-red-600 mt-4 font-medium">{addToCartError}</p>
          )}

          {addedToCart && !addToCartError && (
            <p className="text-sm text-green-700 mt-4 font-medium">
              ✓ Added to your cart! <Link href="/cart" className="underline font-bold">View Cart</Link>
            </p>
          )}

          <div className="mt-8 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || Boolean(selectedVariant && selectedVariant.stock <= 0)}
              className="border border-transparent flex flex-row rounded-xl w-full py-4 justify-center items-center bg-black text-white font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <FiShoppingCart className="mr-2 text-lg" />
              {isAdding ? "Adding..." : "Add to Cart"}
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
            </AccordionItem>

            <AccordionItem title="Delivery / Returns">
              <p>– <strong>Delivery option:</strong> Express shipping and standard shipping options available at checkout.</p>
              <p>– <strong>Exchange policy:</strong> Size exchanges are supported within 30 days.</p>
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
                type="button"
                onClick={() => scroll("left")}
                className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-black hover:text-white transition-all shadow-sm"
              >
                <FiChevronLeft className="text-xl" />
              </button>

              <button
                type="button"
                onClick={() => scroll("right")}
                className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-black hover:text-white transition-all shadow-sm"
              >
                <FiChevronRight className="text-xl" />
              </button>
            </div>
          </div>

          <div className="font-sans relative">
            <div
              ref={sliderRef}
              className="overflow-x-hidden gap-3 md:gap-6 pb-4 flex justify-start scroll-smooth w-full snap-x snap-mandatory"
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