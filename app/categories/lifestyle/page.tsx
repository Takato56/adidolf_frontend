"use client";
import {FaFilter} from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function ProductView() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="margindiv font-sans">
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
                        <span className="text-black font-medium">Lifestyle</span>
                    </li>
                </ul>
            </nav>
        </div>
        <div>
            <p className="texttitle pt-4">Lifestyle</p>
            <p className="subtitle pt-1">Welcome to brandnew styles</p>
        </div>

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
        
        {isFilterOpen && (
            <div className={`${isFilterOpen ? "block" : "hidden"} md:hidden w-full subtitle bg-white border border-gray-300 rounded-lg mt-1 p-3 h-fit`}>
              <div className="md:grid grid-rows-1 grid grid-cols-2 justify-center gap-1">
              
              <div>
                <p className="mb-2 text-[16px]">Price Range</p>
                
                 <div className="flex flex-row flex-wrap gap-2">
                  {["< 500.000VND", "500.000-1.000.000VND", "1.000.000-2.000.000VND", "> 2.000.000VND"].map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg p-2 text-[14px] text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none">
                      <input type="checkbox" name="priceRange" value={item} className="hidden" />
                      <span className="text-[12px]">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>

              </div>
              <div className="w-full mt-3">
                <p className="text-[16px] mb-2">Category</p>
                <div className="flex flex-row flex-wrap gap-2">
                  {["Never gonna give you up", "Never gonna let you down", "Never gonna run around and desert you", "Never gonna make you cry", "Never gonna say goodbye", "Never gonna tell a lie and hurt you"].map((item) => (
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
                    {["S", "XS", "M", "L", "XL", "2XL", "3XL"].map((item) => (
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
        <div className="rounded-lg flex justify-between">
            
            <div className="w-2/4 bg-white border min-w-[175px] border-gray-300 h-fit rounded-lg p-5 mt-4 transition-all hidden md:block">
              <div className="grid grid-rows-1 justify-center gap-8">
              
              <div>
                <p className="mb-2 text-[20px] font-bold">Price Range</p>
                
                 <div className="flex flex-row flex-wrap gap-2">
                  {["< 500.000VND", "500.000-1.000.000VND", "1.000.000-2.000.000VND", "> 2.000.000VND"].map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg p-2 text-[14px] text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none">
                      <input type="checkbox" name="priceRange" value={item} className="hidden" />
                      <span className="font-[16px]">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>

              </div>
              <div className="w-full">
                <p className="text-[20px] font-bold mb-3">Category</p>
                <div className="flex flex-row flex-wrap gap-2">
                  {["We're no strangers to love", "You know the rules and so do I", "A full commitment's what I'm thinking of", "You wouldn't get this from any other guy"," I just wanna tell you how I'm feeling", "Gotta make you understand","Never gonna give you up", "Never gonna let you down", "Never gonna run around and desert you", "Never gonna make you cry", "Never gonna say goodbye", "Never gonna tell a lie and hurt you"].map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none">
                      <input type="checkbox" className="hidden" />
                      <span className="text-[16px]">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="w-full">
                <p className="text-[20px] font-bold mb-2">Size</p>
                  <div className="flex flex-row flex-wrap gap-2">
                    {["S", "XS", "M", "L", "XL", "2XL", "3XL"].map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none">
                  <input type="checkbox" className="hidden" />
                  <span className="text-[16px]">{item}</span>
                </label>
                  ))}
            </div>
            <div className="pt-8">
              <button type="button" className="border flex rounded-md py-1 px-3 ml-auto">Apply</button>
            </div>
          </div>
        </div>
      </div>
          
            <div className="mt-4 md:ml-6">
              <div className="gap-2 md:gap-3.5 grid grid-cols-2  w-full md:grid md:grid-cols-4">
                
                <ProductCard
                  image="https://aceracegear.com/wp-content/uploads/2025/04/m-ln-2025-1.jpg"
                  alt="McLaren 2025 Racingsuit"
                  category="Suit"
                  name="McLaren 2025 Racingsuit"
                  price="$500.00"
                  shopLink="/products"
                />     
                <ProductCard
                  image=".././mclaren-f1-2025-team-polo-fueler.jpg"
                  alt="Cool Looking Lapel"
                  category="Accessories"
                  name="Cool Looking Lapel"
                  price="$99.99"
                  shopLink="support/nuremberg"
                />
                <ProductCard
                  image=".././mclaren-f1-2025-team-polo-fueler.jpg"
                  alt="Cool Looking Lapel"
                  category="Accessories"
                  name="Cool Looking Lapel"
                  price="$99.99"
                  shopLink="support/nuremberg"
                />
                <ProductCard
                  image=".././mclaren-f1-2025-team-polo-fueler.jpg"
                  alt="Cool Looking Lapel"
                  category="Accessories"
                  name="Cool Looking Lapel"
                  price="$99.99"
                  shopLink="support/nuremberg"
                />       
                <ProductCard
                  image=".././mclaren-f1-2025-team-polo-fueler.jpg"
                  alt="Cool Looking Lapel"
                  category="Accessories"
                  name="Cool Looking Lapel"
                  price="$99.99"
                  shopLink="support/nuremberg"
                />       
                <ProductCard
                  image=".././mclaren-f1-2025-team-polo-fueler.jpg"
                  alt="Cool Looking Lapel"
                  category="Accessories"
                  name="Cool Looking Lapel"
                  price="$99.99"
                  shopLink="support/nuremberg"
                />       
                <ProductCard
                  image=".././mclaren-f1-2025-team-polo-fueler.jpg"
                  alt="Cool Looking Lapel"
                  category="Accessories"
                  name="Cool Looking Lapel"
                  price="$99.99"
                  shopLink="support/nuremberg"
                />                  
                <ProductCard
                  image="https://aceracegear.com/wp-content/uploads/2025/04/m-ln-2025-1.jpg"
                  alt="McLaren 2025 Racingsuit"
                  category="Suit"
                  name="McLaren 2025 Racingsuit"
                  price="$500.00"
                  shopLink="support/nuremberg"
                />    
                <ProductCard
                  image="https://aceracegear.com/wp-content/uploads/2025/04/m-ln-2025-1.jpg"
                  alt="McLaren 2025 Racingsuit"
                  category="Suit"
                  name="McLaren 2025 Racingsuit"
                  price="$500.00"
                  shopLink="support/nuremberg"
                />          
                <ProductCard
                  image="https://aceracegear.com/wp-content/uploads/2025/04/m-ln-2025-1.jpg"
                  alt="McLaren 2025 Racingsuit"
                  category="Suit"
                  name="McLaren 2025 Racingsuit"
                  price="$500.00"
                  shopLink="support/nuremberg"
                />                  
              </div>
            </div>
          </div>
        <div className="mt-24"></div>
    </div>
  );
}