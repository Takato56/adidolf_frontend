import Link from "next/link";
import LoadingIcon from "@/components/LoadingIcon";
export default function Categories() {
  return (
    <div>
      <div className="p-4">
        <nav>
          <ul className="flex items-center space-x-2 text-sm font-sans text-black">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li className="text-gray-700 text-sm">&gt;</li>

            <li>
              <span className="text-black font-medium">Categories</span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="ml-4 pt-2 text-[25px] md:text-[37px] md:mx-6 mt-3 text-black font-sans ">
        <div>
          <b>Categories </b>
        </div>
      </div>
      <div className="pl-4 pt-1 text-[20px] md:text-[32px] md:pl-6 text-black font-northwell">
        Define Your Statement
      </div>
      <div className="m-4 md:m-6 bg-[#f8f9ff] rounded-lg">
        <div className="mt-3 font-sans">
          <div className="grid grid-cols-2 justify-center md:grid-cols-3 gap-1 md:gap-1 md:auto-rows-fr">
            <div className="col-span-2 row-span-2 md:row-span-1 aspect-video bg-gray-200 bg-opacity-40 p-6 text-white text-center rounded-lg flex items-center justify-center">
              <LoadingIcon size="sm" />
            </div>

            <div className="aspect-8/9 md:aspect-auto bg-gray-200 bg-opacity-40 p-6 rounded-lg flex items-center justify-center">
              <LoadingIcon size="sm" />
            </div>

            <div className="aspect-8/9 md:aspect-auto bg-gray-200 bg-opacity-40 p-6 rounded-lg flex items-center justify-center">
              <LoadingIcon size="sm" />
            </div>

            <div className="aspect-8/9 md:aspect-auto bg-gray-200 bg-opacity-40 p-6 rounded-lg flex items-center justify-center">
              <LoadingIcon size="sm" />
            </div>

            <div className="aspect-8/9 md:aspect-auto bg-gray-200 bg-opacity-40 p-6 rounded-lg flex items-center justify-center">
              <LoadingIcon size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
