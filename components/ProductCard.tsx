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
    <div className="aspect-4/7 md:h-110 h-70 text-text-primary text-center overflow-hidden font-sans border-border-strong border shadow-md rounded-xl shrink-0 ">
      <div className="md:h-3/4 h-7/10 bg-surface-secondary overflow-hidden">
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="md:h-1/4 h-3/10 w-full px-2 md:px-4 flex flex-col justify-between bg-surface-card text-text-primary">
        <div>
          <p className="text-xs pt-1 md:pt-3 text-[11px] md:text-[13px] text-text-muted text-left">
            {category}
          </p>
          <p className="text-left font-semibold pt-1 text-[15px] md:text-[17px] text-text-secondary line-clamp-1 truncate block w-full">
            {name}
          </p>
        
          <p className="pt-1.5 md:pt-5 flex text-[13px] md:text-[15px]  justify-between font-bold text-red-500">${price}</p>     
        </div>
      </div>
    </div>
    </Link>
  );
}