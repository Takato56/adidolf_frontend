import { Product } from "@/types"; // Hoặc định nghĩa type Product trực tiếp ở đây

export const lifestyleData = {
  title: "Lifestyle",
  subtitle: "Welcome to brandnew styles",
  products: [
    {
      image: "https://aceracegear.com/wp-content/uploads/2025/04/m-ln-2025-1.jpg",
      alt: "McLaren 2025 Racingsuit",
      category: "Suit",
      name: "McLaren 2025 Racingsuit",
      price: "500.00",
      shopLink: "/products",
    },
    {
      image: ".././mclaren-f1-2025-team-polo-fueler.jpg",
      alt: "Cool Looking Lapel",
      category: "Accessories",
      name: "Cool Looking Lapel",
      price: "99.99",
      shopLink: "support/nuremberg",
    },
  ]
};

// Các mảng filter dùng chung hoặc riêng tùy bạn, có thể để ở file cấu hình chung
export const filterPriceRanges = ["< 500.000VND", "500.000-1.000.000VND", "1.000.000-2.000.000VND", "> 2.000.000VND"];
export const filterSizes = ["S", "XS", "M", "L", "XL", "2XL", "3XL"];
export const filterCategories = ["Never gonna give you up", "Never gonna let you down", "Never gonna run around and desert you"];