import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { mockDeals, mockNewArrivals } from "@/data/NewArrivalData";

export default function NewArrivals() {
  return (
    <div>
      {/* Breadcrumbs */}
      <div className="margindiv mt-3">
        <nav className="hidden md:block">
          <ul className="breadcumb">
            <li>
              <Link href="/" className="hover:font-bold hover:underline">
                Home
              </Link>
            </li>
            <li className="text-gray-700 text-sm">&gt;</li>
            <li>
              <span className="text-black font-medium">News</span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Title */}
      <div className="margindiv mt-6">
        <p className="pt-4 texttitle">New Arrivals & Exclusive Deals</p>
        <p className="pt-1 subtitle">Discover our latest collection</p>
      </div>

      {/* Deals of the week Section */}
      <div className="margindiv mt-6 bg-[#E6F2FF] pt-3 pb-5 rounded-2xl">
        <div className="mx-6 text-[18px] md:text-[22px]">
          <b className="font-sans">Deals of the week</b>
        </div>
        <div className="mx-6 mt-3 font-sans">
          <div className="flex overflow-x-auto gap-4 pb-4">
            {mockDeals.map((product, index) => (
              <ProductCard
                key={`deal-${index}`}
                image={product.image}
                alt={product.alt}
                category={product.category}
                name={product.name}
                price={product.price}
                shopLink={product.shopLink}
              />
            ))}
          </div>
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="margindiv p-3 md:p-6 rounded-lg">
        <p className="text-[18px] md:text-[22px] font-bold">New Arrivals</p>
        <div className="mt-3 font-sans">
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            {mockNewArrivals.map((product, index) => (
              <ProductCard
                key={`new-${index}`}
                image={product.image}
                alt={product.alt}
                category={product.category}
                name={product.name}
                price={product.price}
                shopLink={product.shopLink}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}