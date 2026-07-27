// FILE: takato56-adidolf_frontend/app/signup/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/auth";
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

// Standard Vietnamese Phone Number Regex (10 or 11 digits, accepts leading 0 or +84)
const VN_PHONE_REGEX = /^(0|\+84)[0-9]{9,10}$/;

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const validateForm = (): boolean => {
    if (!form.full_name.trim()) {
      setErrorMessage("Please enter your full name.");
      return false;
    }
    if (!form.email.trim()) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    if (!VN_PHONE_REGEX.test(form.phone.trim())) {
      setErrorMessage(
        "Please enter a valid Vietnamese phone number (10 or 11 digits starting with 0 or +84, e.g. 0901234567)."
      );
      return false;
    }
    if (form.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return false;
    }
    if (form.password !== form.confirm_password) {
      setErrorMessage("Passwords do not match. Please verify your confirm password input.");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrorMessage(null);

    const payload = {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
    };

    try {
      await registerUser(payload);
      await loginUser({ email: payload.email, password: payload.password }, true);
      router.push("/");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gray-50/50">
      <div className="bg-white max-w-md w-full rounded-2xl p-8 border border-gray-100 shadow-xl my-8">
        <div className="text-center mb-8">
          <h1 className="font-extrabold text-2xl md:text-3xl tracking-tight text-gray-900">
            Create Your Account
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            Join Adidolf to unlock seamless checkout and order tracking.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium text-center">
            {errorMessage}
          </div>
        )}

        <form className="space-y-4" onSubmit={onSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <FaUser className="absolute left-4 text-gray-400 text-sm pointer-events-none" />
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={(e) => handleField("full_name", e.target.value)}
                placeholder="Nguyen Van A"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black transition"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <FaEnvelope className="absolute left-4 text-gray-400 text-sm pointer-events-none" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => handleField("email", e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black transition"
              />
            </div>
          </div>

          {/* Phone Number (Vietnamese Format) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Phone Number (10–11 digits) <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <FaPhone className="absolute left-4 text-gray-400 text-sm pointer-events-none" />
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={(e) => handleField("phone", e.target.value)}
                placeholder="0901234567 or +84901234567"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password (min 8 characters) <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <FaLock className="absolute left-4 text-gray-400 text-sm pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={(e) => handleField("password", e.target.value)}
                placeholder="Create a strong password"
                required
                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-700 text-sm cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm Password Bar */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <FaLock className="absolute left-4 text-gray-400 text-sm pointer-events-none" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                value={form.confirm_password}
                onChange={(e) => handleField("confirm_password", e.target.value)}
                placeholder="Re-enter your password"
                required
                className="w-full pl-11 pr-11 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black transition"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 text-gray-400 hover:text-gray-700 text-sm cursor-pointer"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50 mt-4"
          >
            {isLoading ? "Creating Account..." : "SIGN UP"}
          </button>

          <p className="text-xs text-center text-gray-600 pt-4">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-black underline">
              LOG IN
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}