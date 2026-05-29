"use client";

import { useState } from "react";

export default function Nuremberg() {
  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedSize, setSelectedSize] = useState(36);

  return (
      <div className="flex gap-8">
        {/* Product Image on the left */}
        <div>
          <img
            src=".././coollookinglapel.jpg"
            alt="product image"
            style={{ width: "200px", height: "auto" }}
          />
        </div>

        {/* Information on the right */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Cool Looking Lapel</h1>
          <p className="mb-4"><strong>BRAND:</strong> Adidolf SS Series</p>
          <p className="mb-4"><strong>AVAILABILITY:</strong> In Stock</p>
          <p className="mb-6">Description: This will make you feel very cool</p>

          {/* Color Selection */}
          <div className="mb-6">
            <span className="text-sm text-gray-600 mr-2">Color:</span>
            {['Black', 'Navy Blue', 'Olive Green'].map((color) => (
              <button
                key={color}
              onClick={() => setSelectedColor(color)}
                className={`px-4 py-2 rounded-full mx-1 transition-colors duration-200 ${
                selectedColor === color
                    ? 'bg-black text-white ring-2 ring-green-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300'
                }`}
              >
                {color}
              </button>
            ))}
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <span className="text-sm text-gray-600 mr-2">Size:</span>
            {[34, 36, 38, 40].map((size) => (
              <button
                key={size}
              onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-full mx-1 transition-colors duration-200 ${
                selectedSize === size
                    ? 'bg-black text-white ring-2 ring-green-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-green-700 mb-4">$4,000,000</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200">
            Add to Cart
          </button>
        </div>
      </div>
    );
}

