import Link from "next/link";

interface ProductCardProps {
  image: string;
  category: string;
  name: string;
  price: string;
  shopLink: string;
  alt?: string;
}

export default function ProductCard({
  image,
  category,
  name,
  price,
  shopLink,
  alt = "Product",
}: ProductCardProps) {
  return (
    <div className="aspect-3/4 text-white text-center overflow-hidden border-gray-300 border shadow-md rounded-xl shrink-0">
      <Link href={shopLink}>
        <div className="h-2/3 w-full relative bg-gray-100 cursor-pointer overflow-hidden">
          <img
            src={image}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
      </Link>
      <div className="h-1/3 w-full px-2 md:px-4 flex text-[12px] md:text-[19px] flex-col justify-between bg-white text-black">
        <div>
          <p className="text-xs pt-2 md:pt-3 text-gray-400 text-left">
            {category}
          </p>
          <h3 className="font-sans text-left pt-1 pb-3 font-medium text-sm text-gray-800 line-clamp-1">
            {name}
          </h3>
        </div>

        <div className="font-sans pt-1 py-3 text-[12px] md:text-[17px] font-bold text-red-500">
          <p>${price}</p>
        </div>
      </div>
    </div>
  );
}
