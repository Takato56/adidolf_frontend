import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function NewArrivals() {
  return (
    <div>
      <div className="margindiv mt-3">
        <nav>
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

      <div className="texttitle margindiv pt-4">
        <div>
          <p>New Arrivals & Exclusive Deals </p>    
        </div>
        <div className="subtitle pt-1">
          Discover our latest collection
        </div>
      </div>
      <div className="margindiv mt-6 bg-[#E6F2FF] pt-3 pb-5 rounded-2xl">
        <div className="mx-6 text-[18px] md:text-[22px]">
          <b className="font-sans">Deals of the week</b>
        </div>
        <div className="mx-6 mt-3 font-sans">
          <div className="flex overflow-x-auto gap-4 pb-4">
            <ProductCard
              image=".././coollookinglapel.jpg"
              alt="Cool Looking Lapel"
              category="Accessories"
              name="Cool Looking Lapel"
              price="$99.99"
              shopLink="support/nuremberg"
            />     
            <div className="aspect-3/4 bg-blue-500 p-6 text-white text-center rounded-lg shrink-0">
              Cột 3
            </div>
            <div className="aspect-3/4 bg-yellow-500 p-6 text-white text-center rounded-lg shrink-0">
              Cột 4
            </div>
            <div className="aspect-9/12 bg-yellow-500 p-6 text-white text-center rounded-lg">
              Cột 4
            </div>
            <div className="aspect-9/12 bg-yellow-500 p-6 text-white text-center rounded-lg">
              Cột 4
            </div>
          </div>
        </div>
      </div>
      <div className="margindiv p-3 md:p-6 rounded-lg">
        <div className="text-[18px] md:text-[22px]">
          <b className="font-sans">New Arrivals</b>
        </div>
        <div className="mt-3 font-sans">
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            <ProductCard
              image=".././coollookinglapel.jpg"
              alt="Cool Looking Lapel"
              category="Accessories"
              name="Cool Looking Lapel"
              price="$99.99"
              shopLink="support/nuremberg"
            />     
            <div className="aspect-9/12 bg-blue-500 p-6 text-white text-center rounded-lg shrink-0 w-40">
              Cột 3
            </div>
            <div className="aspect-9/12 bg-yellow-500 p-6 text-white text-center rounded-lg shrink-0 w-40">
              Cột 4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
