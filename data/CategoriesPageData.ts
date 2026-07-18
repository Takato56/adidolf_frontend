import { Category } from "@/types"; // đổi path nếu Category interface của bạn nằm chỗ khác

// TODO: thay imageUrl bằng ảnh category thật khi có.
// Đang dùng LoremFlickr (ảnh thật, lọc theo tag) + ?lock=N riêng cho từng category
// để ảnh vừa đúng chủ đề fashion vừa không trùng ảnh với nhau
// (và không trùng với các lock đã dùng ở các file data khác trong /data).
export const categoryTiles: Category[] = [
  {
    id: "cat-lifestyle",
    name: "Lifestyle",
    slug: "lifestyle",
    imageUrl: "https://aceracegear.com/wp-content/uploads/2025/04/m-ln-2025-1.jpg",
    description: "Everyday essentials, elevated",
  },
  {
    id: "cat-streetwear",
    name: "Streetwear",
    slug: "streetwear",
    imageUrl: "https://loremflickr.com/800/800/streetwear,fashion?lock=51",
    description: "Bold pieces for the streets",
  },
  {
    id: "cat-formal",
    name: "Formal",
    slug: "formal",
    imageUrl: "https://loremflickr.com/800/500/suit,formalwear?lock=52",
    description: "Sharp looks for sharp occasions",
  },
  {
    id: "cat-activewear",
    name: "Activewear",
    slug: "activewear",
    imageUrl: "https://loremflickr.com/800/800/activewear,fashion?lock=53",
    description: "Built to move with you",
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    imageUrl: "https://loremflickr.com/800/800/accessories,fashion?lock=54",
    description: "The details that finish the look",
  },
];