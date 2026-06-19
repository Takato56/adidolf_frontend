import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function NewArrivals() {
  return (
    <div>
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

      <div className="margindiv">
          <p className="pt-4 texttitle">New Arrivals & Exclusive Deals </p>      
        
          <p className="pt-1 subtitle">Discover our latest collection</p>
        
      </div>
      <div className="margindiv mt-6 bg-[#E6F2FF] pt-3 pb-5 rounded-2xl">
        <div className="mx-6 text-[18px] md:text-[22px]">
          <b className="font-sans">Deals of the week</b>
        </div>
        <div className="mx-6 mt-3 font-sans">
          <div className="flex overflow-x-auto gap-4 pb-4">
            <ProductCard
              image="https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM2_Front%20view.png?wid=1300&hei=1300"
              alt="Cool Looking Lapel"
              category="Accessories"
              name="Cool Looking Lapel"
              price="99.99"
              shopLink="support/nuremberg"
            />     
            <ProductCard
              image="https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM1_Closeup%20view.png?wid=1300&hei=1300"
              alt="Cool Looking Lapel"
              category="Accessories"
              name="Cool Looking Lapel"
              price="99.99"
              shopLink="support/nuremberg"
            />    
            <ProductCard
              image="https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM2_Front%20view.png?wid=1300&hei=1300"
              alt="Cool Looking Lapel"
              category="Accessories"
              name="Cool Looking Lapel"
              price="99.99"
              shopLink="support/nuremberg"
            />     
            <ProductCard
              image="https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM1_Closeup%20view.png?wid=1300&hei=1300"
              alt="Cool Looking Lapel"
              category="Accessories"
              name="Cool Looking Lapel"
              price="99.99"
              shopLink="support/nuremberg"
            />    
          </div>
        </div>
      </div>
      <div className="margindiv p-3 md:p-6 rounded-lg">
          <p className="text-[18px] md:text-[22px] font-bold">New Arrivals</p>
        <div className="mt-3 font-sans">
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">   
            <ProductCard
              image="https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM2_Front%20view.png?wid=1300&hei=1300"
              alt="Cool Looking Lapel"
              category="Accessories"
              name="Cool Looking Lapel"
              price="99.99"
              shopLink="support/nuremberg"
            />     
            <ProductCard
              image="https://fr.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-sac-multipass--M2A078_PM1_Closeup%20view.png?wid=1300&hei=1300"
              alt="Cool Looking Lapel"
              category="Accessories"
              name="Cool Looking Lapel"
              price="99.99"
              shopLink="support/nuremberg"
            />    
          </div>
        </div>
      </div>
    </div>
  );
}
