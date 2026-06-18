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
    <Link href={shopLink}>
    <div className="aspect-5/7 text-white text-center overflow-hidden font-sansborder-gray-300 border shadow-md rounded-xl shrink-0 ">
      <div className="h-2/3 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={alt}
          className="w-full object-cover"
        />
      </div>
      <div className="h-1/3 w-full px-2 md:px-4 flex flex-col justify-between bg-white text-black">
        <div>
          <p className="text-xs pt-1 md:pt-3 text-[11px] md:text-[13px] text-gray-400 text-left">
            {category}
          </p>
          <p className="text-left font-semibold pt-1 text-[15px] md:text-[17px] text-gray-800 line-clamp-1 truncate block w-full">
            {name}
          </p>
        
          <p className="pt-1.5 md:pt-5 flex text-[13px] md:text-[15px]  justify-between font-bold text-red-500">${price}</p>     
        </div>
      </div>
    </div>
    </Link>
  );
}