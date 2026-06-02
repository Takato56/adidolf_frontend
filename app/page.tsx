import Link from 'next/link';
import { DiJava } from 'react-icons/di';
export default function Home() {
  return (
    <div>
      <div className="bg-black h-60 md:h-120"></div>
          <div className='px-3 md:px-6'>
            <p className="pt-3 text-xl md:pt-6 md:text-3xl">
              <b>Shop by Categories</b>
            </p>
        <p className="text-[10px] pt-1 md:text-[14px] flex justify-between">
              Explore our meticulously crafted collections
        <Link href="/categories">
        <u>
          <b>View All</b>
        </u>
        </Link>
      </p>
      </div>
      <div className="bg-black ml-3 mr-3 mt-7 h-60 md:h-80 md:ml-6 md:mr-6"></div>
      <div className="pl-3 md:pl-6">
      <p className="pt-30 text-2xl md:text-3xl">
        <b>Trending Now</b>
      </p>
      <p className="pr-3 pt-1 text-[10px] md:pr-6 md:text-[16px]">
        The most coveted pieces in our collection right now
      </p>
      </div>
      <div className="ml-3 mr-3 mt-7 bg-black h-45 md:ml-6 md:mr-6 md:h-60"></div>
      <div className='h-10'></div>
    </div>
  );
}
