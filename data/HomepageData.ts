export interface Product {
  image: string;
  category: string;
  name: string;
  price: string;
  shopLink: string;
  alt?: string;
}

// TODO: thay các image placeholder này bằng ảnh sản phẩm thật.
// Đang dùng LoremFlickr với tag riêng cho từng loại phụ kiện thời trang + ?lock=N
// để ảnh vừa đúng chủ đề fashion vừa không trùng nhau.
export const mockTrending: Product[] = [
  {
    image: "https://loremflickr.com/800/800/shirt,fashion?lock=5",
    alt: "Trending Product 1",
    category: "Accessories",
    name: "Trending Product 1",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
  {
    image: "https://loremflickr.com/800/800/sunglasses,fashion?lock=2",
    alt: "Trending Product 2",
    category: "Accessories",
    name: "Trending Product 2",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
  {
    image: "https://loremflickr.com/800/800/sneakers,fashion?lock=3",
    alt: "Trending Product 3",
    category: "Accessories",
    name: "Trending Product 3",
    price: "99.99",
    shopLink: "support/nuremberg",
  },
  {
    image: "https://loremflickr.com/800/800/jacket,fashion?lock=4",
    alt: "Trending Product 4",
    category: "Accessories",
    name: "Trending Product 4",
    price: "99.99",
    shopLink: "support/nuremberg",
  }
];