// FILE: takato56-adidolf_frontend/app/checkout/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaMapLocationDot } from "react-icons/fa6";
import { MdOutlinePayment } from "react-icons/md";
import { FaShoppingCart, FaBoxOpen } from "react-icons/fa";
import { useCart } from "@/lib/hooks/useCart";
import { createOrderFromCartApi } from "@/lib/orders";
import { getMyAddressesApi, createCustomerAddressApi } from "@/lib/addresses";
import { getAccessToken } from "@/lib/auth";
import { PaymentMethod, Address } from "@/types";

const SHIPPING_THRESHOLD = 200;
const SHIPPING_FEE = 15;

export default function Checkout() {
  const router = useRouter();
  const {
    items,
    isLoaded,
    subtotal,
    voucherCode,
    voucherError,
    isApplyingVoucher,
    discountAmount,
    applyVoucherCode,
    removeVoucher,
    clearCart,
  } = useCart();

  // ---------- Auth Protection ----------
  useEffect(() => {
    if (!isLoaded) return;
    if (!getAccessToken()) {
      router.replace("/login");
    }
  }, [isLoaded, router]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [couponInput, setCouponInput] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const freeShippingLeft = SHIPPING_THRESHOLD - subtotal;
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const total = afterDiscount + shipping;

  useEffect(() => {
    async function loadAddresses() {
      if (!getAccessToken()) return;
      try {
        const addrs = await getMyAddressesApi();
        setSavedAddresses(addrs);

        const defaultAddr = addrs.find((a) => a.is_default === 1) || addrs[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setForm((prev) => ({
            ...prev,
            fullName: defaultAddr.recipient_name || "",
            phone: defaultAddr.phone || "",
            address: defaultAddr.street_detail || "",
            province: defaultAddr.province || "",
            district: defaultAddr.district || "",
            ward: defaultAddr.ward || "",
          }));
        }
      } catch (err) {
        console.warn("Could not load saved addresses:", err);
      }
    }

    loadAddresses();
  }, []);

  const handleSelectSavedAddress = (addr: Address) => {
    setSelectedAddressId(addr.id);
    setForm((prev) => ({
      ...prev,
      fullName: addr.recipient_name,
      phone: addr.phone,
      address: addr.street_detail,
      province: addr.province || "",
      district: addr.district || "",
      ward: addr.ward || "",
    }));
  };

  const handleNewAddress = () => {
    setSelectedAddressId(null);
    setForm((prev) => ({
      ...prev,
      fullName: "",
      phone: "",
      address: "",
      province: "",
      district: "",
      ward: "",
    }));
  };

  const handleField = (field: keyof typeof form, value: string) => {
    if (selectedAddressId !== null && field !== "email") {
      setSelectedAddressId(null);
    }
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    applyVoucherCode(couponInput.trim());
  };

  const validateCheckoutForm = (): boolean => {
    if (!form.fullName.trim()) {
      setOrderError("Please enter recipient's full name.");
      return false;
    }
    if (!form.phone.trim() || form.phone.trim().length < 8) {
      setOrderError("Please enter a valid phone number.");
      return false;
    }
    if (!form.address.trim()) {
      setOrderError("Please enter your street address.");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateCheckoutForm()) return;

    setIsPlacingOrder(true);
    setOrderError(null);

    try {
      let targetAddressId = selectedAddressId;

      if (!targetAddressId) {
        const address = await createCustomerAddressApi({
          recipient_name: form.fullName.trim(),
          phone: form.phone.trim(),
          province: form.province.trim(),
          district: form.district.trim(),
          ward: form.ward.trim(),
          street_detail: form.address.trim(),
        });
        targetAddressId = address.id;
      }

      await createOrderFromCartApi({
        address_id: targetAddressId,
        payment_method: paymentMethod,
        voucher_code: voucherCode || undefined,
        note: "",
      });

      await clearCart();
      setOrderPlaced(true);
    } catch (err) {
      console.error("Failed to place order:", err);
      setOrderError(
        err instanceof Error ? err.message : "Failed to place order. Please try again."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!isLoaded || !getAccessToken()) {
    return (
      <div className="min-h-screen bg-[#fbfdff] flex items-center justify-center">
        <p className="text-slate-400 font-medium">Checking authorization...</p>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
          ✓
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Order Successful!</h1>
        <p className="text-gray-600 text-sm mb-6 max-w-md">
          Thank you for your order! Your purchase has been received and is now being processed.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/profile"
            className="bg-black text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-neutral-800 transition"
          >
            View Order History
          </Link>
          <Link
            href="/"
            className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-200 transition"
          >
            Continue Shopping
          </Link>
        </div>
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
                <FaShoppingCart />
                Cart
              </Link>
            </li>
            <li className="text-gray-700 text-sm">----</li>

            <li>
              <Link href="/checkout" className="flex flex-row gap-1.5 items-center">
                <FaBoxOpen />
                Checkout
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex md:flex-row justify-center mainmarginproduct gap-4 flex-col">
        <div className="md:w-3/4 w-full rounded-2xl md:px-12 px-6 py-5 bg-[#fafafa] border-gray-200 shadow-xs">
          <p className="texttitle font-extrabold flex flex-row gap-3">
            <FaMapLocationDot />
            Delivery Address
          </p>

          <div className="max-w-4xl py-5 rounded-lg bg-[#fafafa]">
            {savedAddresses.length > 0 && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Choose From Saved Addresses ({savedAddresses.length})
                  </p>
                  {selectedAddressId !== null && (
                    <button
                      type="button"
                      onClick={handleNewAddress}
                      className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                      + Enter New Address
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => handleSelectSavedAddress(addr)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "border-black bg-white ring-1 ring-black shadow-sm"
                            : "border-gray-200 bg-white/70 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-bold text-sm text-gray-900">{addr.recipient_name}</p>
                          {addr.is_default === 1 && (
                            <span className="text-[10px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{addr.phone}</p>
                        <p className="text-xs text-gray-700 mt-1 line-clamp-2">{addr.street_detail}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                    placeholder="Enter recipient's name"
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
                    placeholder="Enter email address"
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
                    placeholder="Enter phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400 text-gray-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 uppercase mb-2">
                    Province / City
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
                    District
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
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleField("address", e.target.value)}
                  placeholder="Enter house number & street details"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder-gray-400 text-gray-700"
                />
              </div>
            </form>

            <p className="texttitle font-extrabold py-5 flex flex-row gap-4">
              <MdOutlinePayment />
              Payment Method
            </p>

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
                <span className="text-gray-700">VNPAY-QR / ATM / Card</span>
              </label>
            </div>
          </div>
        </div>

        <div className="md:w-1/4 w-full">
          <div className="w-full max-w-md mx-auto bg-[#fafafa] p-6 rounded-2xl border-gray-200 shadow-xs">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide mb-4">
              Order Summary
            </h2>

            {freeShippingLeft > 0 ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 mb-4">
                Spend{" "}
                <span className="font-bold text-black">
                  ${freeShippingLeft.toFixed(2)}
                </span>{" "}
                more to qualify for <span className="font-semibold text-green-700">Free Shipping</span>!
                <div className="mt-1.5 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        (subtotal / SHIPPING_THRESHOLD) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2.5 text-xs text-green-800 font-semibold mb-4 text-center">
                ✓ Free Shipping Unlocked!
              </div>
            )}

            {voucherCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded px-3 py-2 mb-4">
                <span className="text-sm font-mono font-semibold text-green-800">
                  {voucherCode} applied
                </span>
                <button
                  onClick={removeVoucher}
                  className="text-xs text-green-700 hover:text-red-600 underline font-medium cursor-pointer"
                >
                  Remove
                </button>
              </div>
            ) : (
              <>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  Coupon Code
                </label>
                <div className="flex">
                  <div className="border border-gray-300 rounded-l overflow-hidden focus-within:border-blue-500 flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="w-full px-4 py-3 text-sm text-[#333] placeholder-gray-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isApplyingVoucher || !couponInput.trim()}
                    className="bg-[#c92127] text-white px-6 text-sm font-bold uppercase hover:bg-red-700 transition-colors shrink-0 rounded-r disabled:opacity-50 cursor-pointer"
                  >
                    {isApplyingVoucher ? "..." : "Apply"}
                  </button>
                </div>
                {voucherError && (
                  <p className="text-xs text-red-600 mt-1.5 font-medium">{voucherError}</p>
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
                  {shipping === 0 ? (
                    <span className="text-green-700 font-bold">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Discount</span>
                <span className="font-bold text-green-700 text-base">-${discountAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-200 my-4"></div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-700 font-medium">Total Payment</span>
              <span className="text-xl font-bold text-[#c92127]">${total.toFixed(2)}</span>
            </div>

            {orderError && (
              <p className="text-xs text-red-600 mb-4 text-center font-medium bg-red-50 p-2.5 rounded border border-red-200">
                {orderError}
              </p>
            )}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              className="w-full bg-[#000000] text-white text-center py-4 rounded-lg font-bold uppercase tracking-wide hover:bg-neutral-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}