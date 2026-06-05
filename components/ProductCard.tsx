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
    <div className="aspect-3/4 text-white text-center overflow-hidden rounded-xl">
      <div className="h-2/3 w-full relative bg-gray-100">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="h-1/3 w-full px-2 md:px-4 flex text-[12px] md:text-[18px] flex-col justify-between bg-white text-black">
        <div>
          <p className="text-xs pt-2 md:pt-4 text-gray-400 text-left">
            {category}
          </p>
          <h3 className="font-sans text-left pt-1 font-medium text-sm text-gray-800 line-clamp-1">
            {name}
          </h3>
        </div>

        <div className="font-sans pt-1 pb-3 flex justify-between font-bold text-red-500">
          <p>${price}</p>
          <Link href={shopLink} >
            <button className="bg-black hover:bg-gray-600 text-white font-sans px-4 md:px-8 md:py-1 rounded-2xl text-[12px] transition-colors duration-100">
              Shop now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
