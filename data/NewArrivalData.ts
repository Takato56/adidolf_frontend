export interface Product {
  image: string;
  category: string;
  name: string;
  price: string;
  shopLink: string;
  alt?: string;
}

// TODO: thay các image placeholder này bằng ảnh sản phẩm thật.
// Đang dùng LoremFlickr với tag riêng cho từng loại sản phẩm + ?lock=N
// để ảnh vừa đúng chủ đề fashion vừa không trùng ảnh với nhau
// (và không trùng với các lock đã dùng ở HomepageData.ts / HomepageCategories.ts / HeroSlides.ts).
export const mockDeals: Product[] = [
  {
    image: "https://loremflickr.com/800/800/hat,fashion?lock=31",
    alt: "Deal Product 1",
    category: "Accessories",
    name: "Deal Product 1",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
  {
    image: "https://loremflickr.com/800/800/tie,fashion?lock=35",
    alt: "Deal Product 2",
    category: "Accessories",
    name: "Deal Product 2",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
  {
    image: "https://loremflickr.com/800/800/belt,fashion?lock=33",
    alt: "Deal Product 3",
    category: "Accessories",
    name: "Deal Product 3",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
  {
    image: "https://loremflickr.com/800/800/backpack,fashion?lock=34",
    alt: "Deal Product 4",
    category: "Accessories",
    name: "Deal Product 4",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
];

export const mockNewArrivals: Product[] = [
  {
    image: "https://loremflickr.com/800/800/coat,fashion?lock=41",
    alt: "New Arrival 1",
    category: "Accessories",
    name: "New Arrival 1",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
  {
    image: "https://loremflickr.com/800/800/boots,fashion?lock=42",
    alt: "New Arrival 2",
    category: "Accessories",
    name: "New Arrival 2",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
];