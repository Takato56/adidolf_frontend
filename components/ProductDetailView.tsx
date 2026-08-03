"use client";

import { useState, useRef } from "react";
import Link from "next/link";
// Thêm FiX vào danh sách import để làm nút đóng ảnh phóng to
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";

// Định nghĩa cấu trúc cho sản phẩm khuyên dùng (Recommended)
interface RecommendedProduct {
  image: string;
  category: string;
  name: string;
  price: string;
  shopLink: string;
  alt?: string;
}

// Định nghĩa cấu trúc dữ liệu động cho chính sản phẩm này
interface ProductDetailType {
  id: string;
  name: string;
  brand: string;
  brandLink: string;
  sku: string;
  price: string;
  images: string[];
  sizes: string[];
  colors: string[];
  description: string[];
  careInstructions: string[];
  deliveryPolicy: string[];
  recommendedProducts: RecommendedProduct[];
}

interface ProductDetailViewProps {
  product: ProductDetailType;
}

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

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const [currentActiveIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false); // State quản lý phóng to ảnh
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX; 
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      if (currentActiveIndex < product.images.length - 1) {
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

  return (
    <div className="mx-auto px-4 md:px-50">
      {/* Breadcrumbs */}
      <div className="mt-3">
        <nav className="hidden md:block">
          <ul className="flex items-center gap-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:underline text-gray-600"> Home </Link>
            </li>
            <li className="text-gray-400">&gt;</li>
            <li>
              <Link href="/products" className="hover:underline text-gray-600"> Products </Link>
            </li>
            <li className="text-gray-400">&gt;</li>
            <li>
              <span className="text-black font-medium">{product.name}</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Container Layout */}
      <div className="mt-10 flex flex-col lg:flex-row gap-10 items-start">
        {/* Images Block */}
        <div className="w-full lg:w-1/2 flex flex-col md:flex-row gap-4 items-stretch md:sticky md:top-6">
          <div 
            className="flex-1 aspect-3/4 overflow-hidden rounded-lg bg-gray-100 relative touch-pan-y cursor-zoom-in"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => setIsZoomed(true)} // Kích hoạt phóng to khi click vào vùng ảnh
          >
            <div 
              className="flex w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `translateX(-${currentActiveIndex * 100}%)` }}
            >
              {product.images.map((src, index) => (
                <div key={index} className="w-full h-full shrink-0">
                  <img 
                    src={src} 
                    className="w-full h-full object-cover object-center select-none" 
                    alt={`${product.name} View ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
              {product.images.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1.5 rounded-full transition-all ${currentActiveIndex === index ? 'w-4 bg-black' : 'w-1.5 bg-gray-400'}`}
                />
              ))}
            </div>
          </div>
            
          {/* Sub Images Side Block */}
          <div className="hidden md:flex flex-col gap-2 w-[80px] md:w-[100px] shrink-0">
            {product.images.map((src, index) => (
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

        {/* Info Right Block */}
        <div className="w-full lg:w-1/2 shadow-md bg-[#f6f6f6] py-6 px-6 md:px-10 font-sans rounded-2xl border border-gray-100">
          <p className="text-[25px] pt-3 md:pt-0 md:text-[30px] font-bold text-gray-900">{product.name}</p>
          
          <div className="mt-2">
            <Link href={product.brandLink} className="inline-block rounded-3xl font-semibold border border-gray-200 px-3 py-0.5 text-[13px] bg-[#FF8000] text-white">
              {product.brand}
            </Link>
          </div>

          <p className="text-[12px] mt-2 text-gray-500">SKU: {product.sku}</p>
          <p className="pt-3 md:pt-5 text-[30px] md:text-[35px] font-bold text-red-600">${product.price}</p>
          
          <div>
            {/* Sizes */}
            <div className="flex flex-row flex-wrap gap-2 mt-6">
              <p className="my-auto font-semibold pr-4 text-gray-700">Size:</p>
              {product.sizes.map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white has-checked:bg-black has-checked:text-white has-checked:border-black select-none transition-all">
                  <input type="radio" name="product-size" value={item} className="hidden" />
                  <span className="text-[14px] md:text-[16px]">{item}</span>
                </label>
              ))}
            </div>       
            
            {/* Colors */}
            <div className="flex flex-row flex-wrap gap-3 mt-6">
              <p className="my-auto font-semibold pr-4 text-gray-700">Color:</p>
              {product.colors.map((item) => (
                <label 
                  key={item} 
                  className="cursor-pointer relative w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center transition-all duration-200 hover:scale-110 has-[:checked]:ring-2 has-[:checked]:ring-black has-[:checked]:ring-offset-2 select-none"
                  style={{ backgroundColor: item }}
                >
                  <input type="radio" name="product-color" value={item} className="hidden" />
                  <span className={`text-[10px] font-bold hidden has-[:checked~span]:block ${item === '#ffffff' ? 'text-black' : 'text-white'}`}>
                    ✓
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row gap-3 mt-8 mb-8">
            <button 
              id="favor" 
              type="button"
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

            <button type="button" className="border border-transparent flex flex-row rounded-lg w-[85%] py-3 justify-center items-center bg-black text-white font-medium hover:bg-gray-800 transition-colors">
              <FiShoppingCart className="mr-2" />
              Add to cart
            </button>
          </div>

          {/* Accordion List */}
          <div className="mt-6 border-t border-gray-300">
            <AccordionItem title="Description">
              {product.description.map((text, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: text }} />
              ))}
            </AccordionItem>

            <AccordionItem title="Product care instructions">
              {product.careInstructions.map((text, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: text }} />
              ))}
            </AccordionItem>

            <AccordionItem title="Delivery / Returns">
              {product.deliveryPolicy.map((text, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: text }} />
              ))}
            </AccordionItem>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      {product.recommendedProducts && product.recommendedProducts.length > 0 && (
        <div className="mt-16 pt-3 px-3 pb-5 rounded-2xl relative group">
          <div className="flex justify-between items-center mb-6">
            <div className="text-[18px] md:text-[22px]">
              <b className="font-sans text-gray-900">Recommended</b>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="p-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm"
                aria-label="Previous products"
              >
                <FiChevronLeft className="text-xl" />
              </button>

              <button
                type="button"
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
              className="overflow-x-hidden gap-3 md:gap-6 pb-4 flex justify-start scroll-smooth w-full snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {product.recommendedProducts.map((recProduct, index) => (
                <div
                  key={`rec-${index}`}
                  className="flex-shrink-0 w-[calc(50%-10px)] md:w-[calc(25%-18px)] snap-start"
                >
                  <ProductCard
                    image={recProduct.image}
                    alt={recProduct.alt || recProduct.name}
                    category={recProduct.category}
                    name={recProduct.name}
                    price={recProduct.price}
                    shopLink={recProduct.shopLink}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal phóng to ảnh */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-zoom-out transition-opacity duration-300 animate-fadeIn"
          onClick={() => setIsZoomed(false)} // Click ra ngoài hoặc click vào để đóng
        >
          {/* Nút đóng hình chữ X */}
          <button 
            type="button"
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-2xl"
            onClick={() => setIsZoomed(false)}
          >
            <FiX />
          </button>
          
          {/* Ảnh phóng to */}
          <div className="max-w-[90vw] max-h-[85vh] md:max-w-[80vw] flex items-center justify-center">
            <img 
              src={product.images[currentActiveIndex]} 
              alt={`${product.name} Zoomed`} 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng khi click trực tiếp vào ảnh (nếu muốn click vào ảnh vẫn đóng thì xóa dòng này)
            />
          </div>
        </div>
      )}

      <div className="mt-10"></div>
    </div>
  );
}