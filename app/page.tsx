import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="bg-black mt-1 h-60 md:h-120"></div>
      <div className="mainmargindiv mt-6">
        <p className="texttitle">
          <b>Shop by Categories</b>
        </p>
        <p className="subtitle mt-1 flex justify-between">
          Explore our meticulously crafted collections
          <Link href="/categories">
            <u>
              <b>View All</b>
            </u>
          </Link>
        </p>
      </div>
      <div className="mainmargindiv mt-7 md:mx-6 bg-blue-20">
        <div className="grid md:grid-cols-3 grid-cols-1 justify-center gap-4 overflow-x-auto">
          <div className="border rounded-lg aspect-video md:aspect-16/10"> A</div>
          <div className="border rounded-lg aspect-video md:aspect-16/10"> A</div>
          <div className="border rounded-lg aspect-video md:aspect-16/10"> A</div>
        </div>
      </div>
      <div className="mainmargindiv mt-10">
        <p className="texttitle">
          <b>Trending Now</b>
        </p>
        <p className="subtitle mt-1">
          The most coveted pieces in our collection right now
        </p>
      </div>
      <div className="mainmargindiv mt-7 "></div>
      <div className="h-10"></div>
    </div>
  );
}