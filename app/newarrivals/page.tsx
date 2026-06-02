import Link from "next/link";
export default function NewArrivals() {
  return (
    <div>
      <div className="p-4">
        <nav>
          <ul className="flex items-center space-x-2 text-sm font-sans text-black">
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

      <div className="ml-4 pt-2 text-2xl md:text-3xl md:mx-6 mt-3 text-black font-sans ">
        <div>
          <b>New Arrivals & Exclusive Deals </b>
          <Link href="/categories/new">-&gt;</Link>
        </div>
      </div>
      <div className="pl-4 pt-2 text-[12px] md:text-[18px] md:pl-6 text-black font-sans">
        Discover our latest collection
      </div>
      <div className="m-4 md:m-6 bg-[#E6F2FF] p-5 rounded-lg">
        <div className="mx-3 text-[18px] md:mx-6 md:text-[22px] flex justify-between">
          <b className="font-sans">Deals of the week</b>
          <p>Ends in:</p>
        </div>
        <div className="m-4 mt-3 md:m-6 font-sans">
          <div className="grid grid-cols-2 justify-center md:grid-cols-5 gap-4 ">
            <div className="aspect-3/4 text-white text-center rounded-lg">
              <div className="h-2/3 w-full relative bg-gray-100">
                <img
                  src="duong-dan-anh-san-pham.jpg"
                  alt="Tên sản phẩm"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-1/3 w-full p-4 flex flex-col justify-between bg-white text-black">
                <div>
                  <p className="text-xs text-gray-400 text-left mt-0.5">
                    Category
                  </p>
                  <h3 className="font-sans mt-2 text-left font-medium text-sm text-gray-800 line-clamp-1">
                    Tên sản phẩm ở đây
                  </h3>
                </div>

                <div className="font-sans flex justify-between font-bold text-red-500">
                  <p>$99.99</p>
                  <button className="bg-black hover:bg-gray-600 text-white font-sans px-5 rounded-2xl text-[12px] transition-colors duration-200">
                    Shop now
                  </button>
                </div>
              </div>
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
