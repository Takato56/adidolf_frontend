'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import { FiShoppingCart, FiHeart, FiMinus, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";

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

export default function Product() {
  const [images] = useState([
    "https://i.pinimg.com/736x/8c/ab/89/8cab892d5b35bee91018ed6744e53679.jpg",
    "https://i.pinimg.com/736x/c0/81/13/c08113b8df8e619f39049291f312504f.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReJxXMq73kmIUEGUAKiLTKZwdnJHBL2fLCOcuusuFmZ84gmgQLFBYgnYrf&s=10",
    "https://tse2.mm.bing.net/th/id/OIP.PgWL-_pupZaymNTXBHQzOQHaIV?rs=1&pid=ImgDetMain&o=7&rm=3"
  ]);

  const [currentActiveIndex, setActiveIndex] = useState(0);
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
              <Link href="/" className="hover:underline text-gray-600"> Products </Link>
            </li>
            <li className="text-gray-400">&gt;</li>
            <li>
              <span className="text-black font-medium">McLaren Racing Suit</span>
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
          <p className="text-[25px] pt-3 md:pt-0 md:text-[30px] font-bold text-gray-900">McLaren Racing Suit 2025</p>
          
          <div className="mt-2">
            <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="inline-block rounded-3xl font-semibold border border-gray-200 px-3 py-0.5 text-[13px] bg-[#FF8000] text-white">
              McLaren
            </Link>
          </div>

          <p className="text-[12px] mt-2 text-gray-500">SKU: OSCARPIASTRI81</p>
          <p className="pt-3 md:pt-5 text-[30px] md:text-[35px] font-bold text-red-600">$500.00</p>
          
          <div>
            <div className="flex flex-row flex-wrap gap-2 mt-6">
              <p className="my-auto font-semibold pr-4 text-gray-700">Size:</p>
              {["S", "XS", "M", "L", "XL", "2XL", "3XL"].map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white has-checked:bg-black has-checked:text-white has-checked:border-black select-none transition-all">
                  <input type="radio" name="product-size" value={item} className="hidden" />
                  <span className="text-[14px] md:text-[16px]">{item}</span>
                </label>
              ))}
            </div>       
            
            <div className="flex flex-row flex-wrap gap-3 mt-6">
              <p className="my-auto font-semibold pr-4 text-gray-700">Color:</p>
              {["#ff0000", "#0000ff", "#000000", "#ffffff", "#008000", "#ffff00"].map((item) => (
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
              <p>Premium professional McLaren racing suit 2025 edition designed for F1 drivers.</p>
              <p>Regular fit tailored for maximum aerodynamics and features FIA-standard fireproof material.</p>
              <p>Signature papaya orange colorway delivers a youthful, modern style with integrated cooling zones.</p>
              <p><strong>Material:</strong> 85% Nomex (fireproof), 15% Kevlar (abrasion resistant).</p>
            </AccordionItem>

            <AccordionItem title="Product care instructions">
              <p>– Machine wash or hand wash on a medium cycle with a short spin, do not soak.</p>
              <p>– Wash at a maximum temperature of 30°C to protect technical fibers.</p>
              <p>– Do not tumble dry in commercial dryer machines.</p>
              <p>– Iron at medium temperature if necessary.</p>
              <p>– Do not pour detergent, soap, or strong bleach directly onto the product.</p>
              <p>– Do not dry directly under harsh sunlight to prevent the signature orange paint from fading.</p>
              <p>– Wash with similar colors.</p>
            </AccordionItem>

            <AccordionItem title="Delivery / Returns">
              <p>– <strong>Delivery option:</strong> Nationwide express shipping or secured standard shipping available.</p>
              <p>– <strong>Exchange policy:</strong> Size exchanges are supported within 30 days for full-priced items (requires original tags, packaging, and original unused condition).</p>
              <p>– Return policy does not apply to items from deep clearance or promotional sales.</p>
              <p>– Refund requests are not supported after signing for the product unless there is a manufacturer defect.</p>
            </AccordionItem>
          </div>
        </div>

      </div>

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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[calc(50%-10px)] md:w-[calc(25%-18px)] snap-start"
              >
                <ProductCard
                  image={index % 2 === 0
                    ? "https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM2_Front%20view.png?wid=1300&hei=1300"
                    : "https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM1_Closeup%20view.png?wid=1300&hei=1300"
                  }
                  alt="Cool Looking Lapel"
                  category="Accessories"
                  name="Cool Looking Lapel"
                  price="99.99"
                  shopLink="support/nuremberg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10"></div>
    </div>
  );
}