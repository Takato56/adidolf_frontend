import Link from "next/link";
import LoadingIcon from "@/components/LoadingIcon";
import style from "./page.module.css";
export default function Categories() {
  return (
    <div>
      <div className="margindiv mt-3">
        <nav>
          <ul className="breadcumb">
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
      <div className="texttitle margindiv pt-4">
        <div>
          <p>Categories </p>
        </div>
        <div className="subtitle pt-1">
          Define Your Statement
        </div>
      </div>
      <div className="margindiv bg-[#f8f9ff] rounded-lg">
        <div className="mt-3 font-sans">
          <div className="grid grid-cols-2 justify-center md:grid-cols-4 gap-1 md:gap-1 md:auto-rows-fr">
            <div className="col-span-2 md:col-span-3 row-span-2 md:row-span-1 md:aspect-24/9 aspect-video bg-gray-200 bg-opacity-40 p-6 text-white text-center rounded-lg flex items-center justify-center">
              <LoadingIcon size="sm" />
            </div>

            <div className="aspect-8/9 md:aspect-auto bg-gray-200 bg-opacity-40 p-6 rounded-lg flex items-center justify-center">
              <LoadingIcon size="sm" />
            </div>

            <div className="md:col-span-2 col-span-1 row-span-1  md:aspect-auto bg-gray-200 bg-opacity-40 p-6 text-white text-center rounded-lg flex items-center justify-center">
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
      <div className="mt-8"></div>
    </div>
  );
}
