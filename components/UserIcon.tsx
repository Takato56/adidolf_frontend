// FILE: takato56-adidolf_frontend/components/UserIcon.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { logoutUser } from "@/lib/auth";

interface UserSession {
  name: string;
  role: string;
}

function getSession(): UserSession | null {
  if (typeof window === "undefined") return null;
  const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
  const name = sessionStorage.getItem("userName") || localStorage.getItem("userName");
  const role = sessionStorage.getItem("userRole") || localStorage.getItem("userRole");

  if (!token || !name || !role) return null;
  return { name, role };
}

export default function UserIcon() {
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Read session on mount and whenever storage/auth changes
  useEffect(() => {
    setSession(getSession());

    const onStorage = () => setSession(getSession());
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onStorage);
    window.addEventListener("authchange", onStorage);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onStorage);
      window.removeEventListener("authchange", onStorage);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    setOpen(false);
    await logoutUser();
    setSession(null);
    router.push("/");
    router.refresh();
  }

  const isAdmin = session?.role === "admin";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="cursor-pointer text-[#64748B] hover:text-black transition-colors flex items-center justify-center"
        aria-label="Account menu"
        aria-expanded={open}
      >
        <FaUser />
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-100 rounded-xl shadow-lg overflow-hidden z-50">
          {session ? (
            <>
              {/* Logged-in Header */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-sm font-semibold text-black truncate">
                  {session.name}
                </p>
              </div>

              <div className="py-1">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Profile
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="py-1">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}