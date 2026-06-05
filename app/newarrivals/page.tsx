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
      <div className="margindiv mt-3 bg-[#E6F2FF] pt-3 pb-5 rounded-2xl">
        <div className="margindiv text-[18px] md:text-[22px]">
          <b className="font-sans">Deals of the week</b>
        </div>
        <div className="m-4 mt-3 md:m-6 font-sans">
          <div className="grid grid-cols-2 justify-center md:grid-cols-5 gap-4 ">
            <ProductCard
              image="./coollookinglapel.jpg"
              alt="Cool Looking Lapel"
              category="Accessories"
              name="Cool Looking Lapel"
              price="$99.99"
              shopLink="support/nuremberg"
            />
            <div className="aspect-9/12 bg-blue-500 p-6 text-white text-center rounded-lg">
              Cột 3
            </div>
            <div className="aspect-9/12 bg-yellow-500 p-6 text-white text-center rounded-lg">
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
      <div className="m-6  p-5 rounded-lg">
        <div className="mx-2 text-[18px] md:mx-4 md:mb-5 md:text-[22px]">
          <b className="font-sans">New Arrivals</b>
        </div>
        <div className="mx-2 mt-3 md:mx-4 font-sans">
          <div className="grid grid-cols-2 justify-center md:grid-cols-5 gap-4 ">
            <div className="aspect-3/4 bg-green-500 p-6 text-white text-center rounded-lg">
              Cột 2
            </div>
            <div className="aspect-9/12 bg-blue-500 p-6 text-white text-center rounded-lg">
              Cột 3
            </div>
            <div className="aspect-9/12 bg-yellow-500 p-6 text-white text-center rounded-lg">
              Cột 4
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
