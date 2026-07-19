export interface HeroSlide {
  id: number;
  bg: string; // fallback color, shown while imageUrl loads / if it fails
  imageUrl: string;
  text: string;
  sub: string;
}

// TODO: thay imageUrl bằng ảnh banner thật (mỗi slide phải là ảnh khác nhau).
// Đang dùng LoremFlickr (ảnh thật, lọc theo tag "fashion") + ?lock=N riêng cho từng slide
// để đảm bảo đúng chủ đề thời trang và không trùng ảnh.
export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    bg: "bg-neutral-900",
    imageUrl: "https://loremflickr.com/1600/900/summer,fashion?lock=11",
    text: "Summer Collection 2026",
    sub: "Up to 50% Off",
  },
  {
    id: 2,
    bg: "bg-zinc-800",
    imageUrl: "https://loremflickr.com/1600/900/streetwear,fashion?lock=12",
    text: "New Arrivals Just Dropped",
    sub: "Explore premium streetwear",
  },
  {
    id: 3,
    bg: "bg-stone-900",
    imageUrl: "https://loremflickr.com/1600/900/minimal,fashion?lock=13",
    text: "The Essentials Pack",
    sub: "Meticulously crafted basics",
  },
];