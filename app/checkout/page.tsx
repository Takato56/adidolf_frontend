"use client";

import { useState } from "react";
import Link from "next/link";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdOutlinePayment } from "react-icons/md";
import { FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import { useCart } from "@/lib/hooks/useCart";
import { useOrders } from "@/lib/hooks/useOrders";
import { createAddressApi } from "@/lib/addresses";
import { PaymentMethod } from "@/types";

// Pulls userId straight out of the access token already sitting in
// sessionStorage instead of a separate API call — the JWT payload is just
// base64, no request needed.
function getCurrentUserId(): number | null {
  const token = sessionStorage.getItem("accessToken");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

const SHIPPING_THRESHOLD = 200;
const SHIPPING_FEE = 15;

export default function Checkout() {
  const {
    items,
    isLoaded,
    subtotal,
    voucher,
    voucherError,
    isApplyingVoucher,
    discountAmount,
    applyVoucherCode,
    removeVoucher,
    clearCart,
  } = useCart();
  const { addOrder } = useOrders();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [couponInput, setCouponInput] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const afterDiscount = subtotal - discountAmount;
  const shipping = afterDiscount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = afterDiscount + shipping;

  const handleField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    applyVoucherCode(couponInput.trim());
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const userId = getCurrentUserId();
      const address = await createAddressApi(userId ?? 0, {
        recipient_name: form.fullName,
        phone: form.phone,
        province: form.province,
        district: form.district,
        ward: form.ward,
        street_detail: form.address,
      });
      await addOrder({
        userId: userId ?? 0,
        addressId: address.id,
        voucherId: voucher?.id ?? 0,
        status: "pending",
        discountAmount,
        shippingFee: shipping,
        note: "",
        createdAt: new Date().toISOString(),
        items: items.map((i) => ({
          productId: parseInt(i.productId, 10) || 0,
          variantId: i.variantId ? parseInt(i.variantId, 10) || null : null,
          productName: i.name,
          variantInfo: [i.color, i.size].filter(Boolean).join(" / ") || null,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
        })),
      } as any);
      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      console.error("Failed to place order:", err);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <h1 className="text-2xl font-bold mb-2">✓ Order placed!</h1>
        <Link href="/" className="text-blue-600 underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (isLoaded && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <h1 className="text-xl font-bold mb-2">Your cart is empty</h1>
        <Link href="/" className="text-blue-600 underline">
          Start shopping
        </Link>
      </div>
    );
  }

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
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 uppercase mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleField("fullName", e.target.value)}
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
                    value={form.email}
                    onChange={(e) => handleField("email", e.target.value)}
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
                    value={form.phone}
                    onChange={(e) => handleField("phone", e.target.value)}
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
                  <input
                    type="text"
                    value={form.province}
                    onChange={(e) => handleField("province", e.target.value)}
                    placeholder="Enter province / city"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 uppercase mb-2">
                    District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={(e) => handleField("district", e.target.value)}
                    placeholder="Enter district"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400 text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 uppercase mb-2">
                    Ward / Commune
                  </label>
                  <input
                    type="text"
                    value={form.ward}
                    onChange={(e) => handleField("ward", e.target.value)}
                    placeholder="Enter ward"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400 text-gray-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 uppercase mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleField("address", e.target.value)}
                  placeholder="Enter your address"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400 text-gray-700"
                />
              </div>
            </form>
            <p className="texttitle font-extrabold py-5 flex flex-row gap-4">
              <MdOutlinePayment></MdOutlinePayment>
              Payment</p>
            <div className="space-y-4">
              <div className="flex items-center gap-2"></div>

              <div className="space-y-3 pl-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === "COD"}
                    onChange={() => setPaymentMethod("COD")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Cash on Delivery (COD)</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment-method"
                    checked={paymentMethod === "VNPay"}
                    onChange={() => setPaymentMethod("VNPay")}
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

          {voucher ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2">
              <span className="text-sm font-mono font-semibold text-green-800">{voucher.code} applied</span>
              <button onClick={removeVoucher} className="text-xs text-green-700 hover:text-red-600 underline">
                Remove
              </button>
            </div>
          ) : (
            <>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Coupon Code</label>
              <div className="flex">
                <div className="border border-gray-300 rounded-l overflow-hidden focus-within:border-blue-500 flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="w-full px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingVoucher || !couponInput.trim()}
                  className="bg-[#c92127] text-white px-6 text-sm font-bold uppercase hover:bg-red-700 transition-colors shrink-0 rounded-r disabled:opacity-50"
                >
                  {isApplyingVoucher ? "..." : "Apply"}
                </button>
              </div>
              {voucherError && (
                <p className="text-xs text-red-600 mt-1.5">{voucherError}</p>
              )}
            </>
          )}

          <div className="border-t-2 border-dashed border-gray-200 my-4"></div>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900 text-base">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Shipping Fee</span>
              <span className="font-bold text-gray-900 text-base">
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Discount</span>
              <span className="font-bold text-gray-900 text-base">-${discountAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-200 my-4"></div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-700 font-medium">Total Payment</span>
            <span className="text-xl font-bold text-[#c92127]">${total.toFixed(2)}</span>
          </div>

          <div className="border-t border-dashed border-gray-200 my-4"></div>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="w-full bg-[#000000] text-white text-center py-4 rounded-lg font-bold uppercase tracking-wide hover:bg-gray-400 transition-colors disabled:opacity-50"
          >
            {isPlacingOrder ? "Placing order..." : "Place Order"}
          </button>
        </div></div>
      </div>
    </div>
  );
}