'use client';
import { useState, useRef } from "react";
import Link from "next/link";
import { FiShoppingCart, FiHeart } from "react-icons/fi";

export default function Product() {
  const [images] = useState([
    "https://i.pinimg.com/736x/8c/ab/89/8cab892d5b35bee91018ed6744e53679.jpg",
    "https://i.pinimg.com/736x/c0/81/13/c08113b8df8e619f39049291f312504f.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReJxXMq73kmIUEGUAKiLTKZwdnJHBL2fLCOcuusuFmZ84gmgQLFBYgnYrf&s=10",
    "https://tse2.mm.bing.net/th/id/OIP.PgWL-_pupZaymNTXBHQzOQHaIV?rs=1&pid=ImgDetMain&o=7&rm=3"
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
  touchStartX.current = e.targetTouches[0].clientX;
  touchEndX.current = e.targetTouches[0].clientX; 
};

const handleTouchMove = (e: React.TouchEvent) => {
  touchEndX.current = e.targetTouches[0].clientX;
};

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      if (activeIndex < images.length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    }
    if (touchStartX.current - touchEndX.current < -50) {
      if (activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    }
  };

  return (
    <div>
      <div className="margindiv mt-3">
        <nav className="hidden md:block">
          <ul className="breadcumb">
            <li>
              <Link href="/" className="hover:underline"> Home </Link>
            </li>
            <li className="text-gray-700 text-sm">&gt;</li>
            <li>
              <Link href="/" className="hover:underline"> Products </Link>
            </li>
            <li className="text-gray-700 text-sm">&gt;</li>
            <li>
              <span className="text-black font-medium">Ma san pham</span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mainmarginproduct md:flex mt-10">
        <div className="w-full flex flex-col md:flex-row gap-4 items-start">
          
          <div 
            className="w-full md:w-3/5 aspect-3/4 overflow-hidden rounded-lg bg-gray-100 relative touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `scaleX(1) translateX(-${activeIndex * 100}%)` }}
            >
              {images.map((src, index) => (
                <div key={index} className="w-full h-full flex-shrink-0">
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
                  className={`h-1.5 rounded-full transition-all ${activeIndex === index ? 'w-4 bg-black' : 'w-1.5 bg-gray-400'}`}
                />
              ))}
            </div>
          </div>
            
          <div className="md:w-[14.5%] flex-col gap-2 hidden md:flex">
            {images.map((src, index) => (
              <div 
                key={index}
                className={`w-full aspect-3/4 overflow-hidden rounded-lg bg-gray-100 cursor-pointer border-2 transition-all ${
                  activeIndex === index ? 'border-black' : 'border-transparent hover:border-gray-400'
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

        <div className="w-full md:w-3/5 font-sans rounded-2xl border-gray-200">
          <p className="text-[25px] pt-3 md:pt-0 md:text-[30px] font-bold">McLaren Racing Suit 2025</p>
          <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="rounded-3xl font-semibold border border-gray-200 px-2 py-0.5 text-[13px] items-center bg-[#FF8000]">
            McLaren
          </Link>
          <p className="text-[12px] mt-1">SKU: OSCARPIASTRI81</p>
          <p className="pt-3 md:pt-6 text-[30px] md:text-[35px] font-bold text-red-600">$500.00</p>
          
          <div>
            <div className="flex flex-row flex-wrap gap-2 mt-8">
              <p className="my-auto font-semibold pr-1 md:pr-5 ">Size:</p>
              {["S", "XS", "M", "L", "XL", "2XL", "3XL"].map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 bg-white has-[:checked]:bg-black has-[:checked]:text-white has-[:checked]:border-black select-none">
                  <input type="radio" name="product-size" value={item} className="hidden" />
                  <span className="text-[14px] md:text-[16px]">{item}</span>
                </label>
              ))}
            </div>       
            
            <div className="flex flex-row flex-wrap gap-3 mt-8">
              <p className="my-auto font-semibold pr-1 md:pr-5">Color:</p>
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

          <div className="flex flex-row flex-wrap gap-1 mt-8">
            <button id="favor" className="border border-gray-400 flex flex-row rounded-lg w-[10%] py-2 justify-center items-center" onClick={() => {
              const element = document.getElementById("favor");
              if (element) {
                if (element.style.backgroundColor === "red") {
                  element.style.backgroundColor = "white";
                } else {
                  element.style.backgroundColor = "red";
                }
              }
            }}>
              <FiHeart />
            </button>
            <button className="border border-gray-400 flex flex-row rounded-lg w-[88%] py-2 justify-center items-center">
              <FiShoppingCart className="mr-2" />
              Add to cart
            </button>
          </div>    
        </div>
      </div>
      <div className="mt-20"></div>
    </div>
  );
}