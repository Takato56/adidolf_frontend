import { Category } from "@/types"; // đổi path nếu Category interface của bạn nằm chỗ khác

// TODO: thay imageUrl bằng ảnh category thật khi có.
// Đang dùng LoremFlickr (ảnh thật, lọc theo tag) thay vì placeholder màu phẳng,
// mỗi category 1 tag + ?lock=N khác nhau để đảm bảo không trùng ảnh.
export const homepageCategories: Category[] = [
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
    imageUrl: "https://loremflickr.com/800/500/streetwear,fashion?lock=21",
    description: "Bold pieces for the streets",
  },
  {
    id: "cat-formal",
    name: "Formal",
    slug: "formal",
    imageUrl: "https://loremflickr.com/800/500/suit,formalwear?lock=22",
    description: "Sharp looks for sharp occasions",
  },
];