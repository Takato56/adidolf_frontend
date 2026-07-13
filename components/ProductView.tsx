"use client";
import { FaFilter } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

// Định nghĩa cấu trúc sản phẩm
interface Product {
  image: string;
  category: string;
  name: string;
  price: string;
  shopLink: string;
  alt?: string;
}

// Định nghĩa tất cả dữ liệu động nhận từ trang gọi nó
interface ProductViewProps {
  categorySlug: string;
  title: string;
  subtitle: string;
  products: Product[];
  filterPriceRanges: string[];
  filterCategories: string[];
  filterSizes: string[];
}

export default function ProductView({ 
  categorySlug, 
  title, 
  subtitle, 
  products = [],
  filterPriceRanges = [],
  filterCategories = [],
  filterSizes = []
}: ProductViewProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
          <select id="sort" name="sorttype" className="text-[14px] md:text-[18px] ml-2 font-bold bg-[#fafeff] border rounded-sm">
            <option value="newest">Newest first</option>
            <option value="lowtohigh">Low to High</option>
            <option value="hightolow">High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>
      
      {/* Mobile Filters */}
      {isFilterOpen && (
        <div className="block md:hidden w-full subtitle bg-white border border-gray-300 rounded-lg mt-1 p-3 h-fit">
          <div className="grid grid-cols-2 justify-center gap-1">
            <div>
              <p className="mb-2 text-[16px]">Price Range</p>
              <div className="flex flex-row flex-wrap gap-2">
                {filterPriceRanges.map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg p-2 text-[14px] text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none">
                    <input type="checkbox" name="priceRange" value={item} className="hidden" />
                    <span className="text-[12px]">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="w-full mt-3">
              <p className="text-[16px] mb-2">Category</p>
              <div className="flex flex-row flex-wrap gap-2">
                {filterCategories.slice(0, 6).map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none">
                    <input type="checkbox" name="category" value={item} className="hidden" />
                    <span className="text-[12px]">{item}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="w-full mt-3">
              <p className="text-[16px] mb-2">Size</p>
              <div className="flex flex-row flex-wrap gap-2">
                {filterSizes.map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-[14px] text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none">
                    <input type="checkbox" className="hidden" name="size" value={item} />
                    <span className="text-[12px]">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="rounded-lg flex flex-row items-start">
        {/* Desktop Filters Sidebar */}
        <div className="w-full md:w-1/4 lg:w-1/5 bg-white border shadow-md min-w-[240px] border-gray-300 h-fit rounded-lg p-5 mt-4 transition-all hidden md:block">
          <div className="grid grid-rows-1 justify-center gap-8">
            <div>
              <p className="mb-2 text-[20px] font-bold">Price Range</p>
              <div className="flex flex-row flex-wrap gap-2">
                {filterPriceRanges.map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg p-2 text-[14px] text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none">
                    <input type="checkbox" name="priceRange" value={item} className="hidden" />
                    <span className="text-[16px]">{item}</span>
                  </label>
                ))}
              </div>
            </div>
             
            <div className="w-full">
              <p className="text-[20px] font-bold mb-3">Category</p>
              <div className="flex flex-row flex-wrap gap-2">
                {filterCategories.map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none">
                    <input type="checkbox" className="hidden" name="category" value={item} />
                    <span className="text-[16px]">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="w-full">
              <p className="text-[20px] font-bold mb-2">Size</p>
              <div className="flex flex-row flex-wrap gap-2">
                {filterSizes.map((item) => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none">
                    <input type="checkbox" className="hidden" name="size" value={item} />
                    <span className="text-[16px]">{item}</span>
                  </label>
                ))}
              </div>
              <div className="pt-8">
                <button type="button" className="border flex rounded-md py-1 px-3 ml-auto hover:bg-black hover:text-white transition-all">Apply</button>
              </div>
            </div>
          </div>
        </div>
         
        {/* Dynamic Product Grid */}
        <div className="mt-4 md:ml-6 flex-1">
          <div className="gap-3 md:gap-4 grid grid-cols-2 w-full md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
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