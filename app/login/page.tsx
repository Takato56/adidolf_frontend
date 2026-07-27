// FILE: takato56-adidolf_frontend/app/login/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/auth";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    try {
      await loginUser({ email: email.trim(), password }, keepSignedIn);
      router.push("/");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Invalid credentials. Please try again."
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
            Sign In to Adidolf
          </h1>
          <p className="text-xs text-gray-500 mt-2">
            Welcome back! Enter your details to access your account.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium text-center">
            {errorMessage}
          </div>
        )}

        <form className="space-y-5" onSubmit={onSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-black focus:bg-white focus:ring-1 focus:ring-black transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <FaLock className="absolute left-4 text-gray-400 text-sm pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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

          {/* Keep me signed in & Forgot password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
              <input
                type="checkbox"
                name="keepsignedin"
                checked={keepSignedIn}
                onChange={(e) => setKeepSignedIn(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
              />
              Keep me signed in
            </label>

            <Link
              href="/support/contact-us"
              className="text-gray-500 font-semibold hover:text-black hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? "Signing In..." : "SIGN IN"}
          </button>

          <p className="text-xs text-center text-gray-600 pt-4">
            Don't have an account?{" "}
            <Link href="/signup" className="font-bold text-black underline">
              CREATE AN ACCOUNT
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}