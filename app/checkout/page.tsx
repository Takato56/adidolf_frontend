import Link from "next/link";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdOutlinePayment } from "react-icons/md";
import { FaShoppingCart, FaBoxOpen } from "react-icons/fa";

export default function Checkout() {
  return (
    <div>
      <div className="margindiv mt-3">
        <nav>
          <ul className="checkoutbreadcumb flex justify-center">
            <li>
              <Link href="/cart" className="flex flex-row gap-1.5 items-center">
                <FaShoppingCart></FaShoppingCart>
                Cart
              </Link>
            </li>
            <li className="text-gray-700 text-sm">----</li>

            <li>
              <Link href="/checkout" className="flex flex-row gap-1.5 items-center">
              <FaBoxOpen></FaBoxOpen>
              Checkout
              </Link>
            </li>
          </ul>
        </nav>
      </div>


      <div className="flex md:flex-row justify-center mainmarginproduct gap-4 flex-col ">
            <div className="md:w-3/4 w-full rounded-2xl md:px-12 px-6 py-5 bg-[#fafafa] border-gray-200 shadow-xs">
            <p className="texttitle font-extrabold flex flex-row gap-3 ">
                <FaMapLocationDot></FaMapLocationDot>
                Address</p>

            <div className="max-w-4xl py-5 rounded-lg bg-[#fafafa]">
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400 text-gray-700"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400 text-gray-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input 
              type="tel" 
              placeholder="Enter your phone number" 
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400 text-gray-700"
            />
          </div>
          <div className="hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase mb-2">
              Province / City <span className="text-red-500">*</span>
            </label>
            <select 
              defaultValue=""
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white text-gray-400"
            >
              <option value="" disabled>Select province / city...</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase mb-2">
              District <span className="text-red-500">*</span>
            </label>
            <select 
              defaultValue=""
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white text-gray-400"
            >
              <option value="" disabled>Select district...</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-900 uppercase mb-2">
              Ward / Commune
            </label>
            <select 
              defaultValue=""
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white text-gray-400"
            >
              <option value="" disabled>Select ward...</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-900 uppercase mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter your address" 
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400 text-gray-700"
          />
        </div>

      </form>
       <p className="texttitle font-extrabold py-5 flex flex-row gap-4">
        <MdOutlinePayment></MdOutlinePayment>
        Payment</p>
       <div className="space-y-4">
  <div className="flex items-center gap-2">
  </div>

  <div className="space-y-3 pl-1">
    <label className="flex items-center gap-3 cursor-pointer">
      <input 
        type="radio" 
        name="payment-method" 
        defaultChecked 
        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      <span className="text-gray-700">Cash on Delivery (COD)</span>
    </label>

    <label className="flex items-center gap-3 cursor-pointer">
      <input 
        type="radio" 
        name="payment-method" 
        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
      />
      <span className="text-gray-700">ATM / Visa / Master / JCB / QR Pay via VNPAY-QR</span>
    </label>
  </div>
</div>
</div>
    
        </div>
        <div className="md:w-1/4 w-full"><div className="w-full max-w-md mx-auto bg-[#fafafa] p-6 rounded-2xl border-gray-200 shadow-xs">
  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">Order Summary</h2>
  
    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Coupon Code</label>
    <div className="border border-gray-300 rounded overflow-hidden focus-within:border-blue-500">
      
      <input 
        type="text" 
        placeholder="Enter coupon code" 
        className="px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
      />
      
      
    </div>
    <button type="button" className="bg-[#c92127] text-white px-6 text-sm font-bold uppercase hover:bg-red-700 transition-colors shrink-0">
        Apply
      </button>

  <div className="border-t-2 border-dashed border-gray-200 my-4"></div>

  <div className="space-y-3 text-sm text-gray-600">
    <div className="flex justify-between items-center">
      <span>Subtotal</span>
      <span className="font-bold text-gray-900 text-base">$376.00</span>
    </div>
    
    <div className="flex justify-between items-center">
      <span>Shipping Fee</span>
      <span className="font-bold text-gray-900 text-base">$30.00</span>
    </div>

    <div className="flex justify-between items-center">
      <span>Discount</span>
      <span className="font-bold text-gray-900 text-base">-$0.00</span>
    </div>
  </div>

  <div className="border-t border-dashed border-gray-200 my-4"></div>

  <div className="flex justify-between items-center mb-6">
    <span className="text-sm text-gray-700 font-medium">Total Payment</span>
    <span className="text-xl font-bold text-[#c92127]">$406.00</span>
  </div>

  <div className="border-t border-dashed border-gray-200 my-4"></div>

  <button type="submit" className="w-full bg-[#000000] text-white text-center py-4 rounded-lg font-bold uppercase tracking-wide hover:bg-gray-400 transition-colors">
    Place Order
  </button>
</div></div>
      </div>
    </div>
  );
}