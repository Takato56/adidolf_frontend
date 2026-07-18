"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchWithAuth, logoutUser } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Profile {
  full_name: string;
  email: string;
  phone: string;
  role: string;
  created_at?: string;
}

function getStoredSession() {
  if (typeof window === "undefined") return null;
  const token = sessionStorage.getItem("accessToken");
  const name = sessionStorage.getItem("userName");
  const role = sessionStorage.getItem("userRole");
  if (!token || !name || !role) return null;
  return { name, role };
}

function getInitials(name?: string | null) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatMemberSince(dateString?: string) {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = getStoredSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const sessionName = session.name;
    const sessionRole = session.role;

    async function loadProfile() {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/user/me`);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const json = await res.json();
        const data = json.data ?? {};
        setProfile({
          full_name: data.full_name || sessionName,
          email: data.email ?? "",
          phone: data.phone ?? "",
          role: data.role || sessionRole,
          created_at: data.created_at,
        });
      } catch (err) {
        console.error(err);
        // Fall back to what we already have in session storage so the
        // page still renders something useful even if /user/me isn't
        // reachable.
        setProfile({
          full_name: sessionName,
          email: "",
          phone: "",
          role: sessionRole,
        });
        setError("Couldn't load all of your account details.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleLogout() {
    await logoutUser();
    window.dispatchEvent(new Event("authchange"));
    router.push("/");
  }

  if (loading) {
    return (
      <div>
        <div className="margindiv mt-6 mb-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
            <div className="h-28 md:h-40 bg-gray-200 relative">
              <div className="absolute -bottom-10 md:-bottom-12 left-6 md:left-10 w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-300 ring-4 ring-white" />
            </div>
            <div className="pt-14 md:pt-16 px-6 md:px-10 pb-8 md:pb-10">
              <div className="h-5 w-48 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-100 rounded mt-2" />
              <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="h-16 bg-gray-100 rounded-xl" />
                <div className="h-16 bg-gray-100 rounded-xl" />
                <div className="h-16 bg-gray-100 rounded-xl" />
                <div className="h-16 bg-gray-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isAdmin = profile.role === "admin";
  const memberSince = formatMemberSince(profile.created_at);

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
              <span className="text-black font-medium">Profile</span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="texttitle margindiv pt-4">
        <div>
          <p>My Profile</p>
        </div>
        <div className="subtitle pt-1">View your account details</div>
      </div>

      <div className="margindiv mt-6 mb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cover + avatar */}
          <div className="h-28 md:h-40 bg-black relative">
            <div
              className={`absolute -bottom-10 md:-bottom-12 left-6 md:left-10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold uppercase ring-4 ring-white ${
                isAdmin ? "bg-black text-white" : "bg-gray-100 text-black"
              }`}
              aria-hidden="true"
            >
              {getInitials(profile.full_name)}
            </div>
          </div>

          <div className="pt-14 md:pt-16 px-6 md:px-10 pb-8 md:pb-10">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-bold text-xl md:text-2xl truncate">
                {profile.full_name}
              </p>
              {isAdmin && (
                <span className="text-xs bg-black text-white font-medium px-2 py-0.5 rounded-full shrink-0">
                  Admin
                </span>
              )}
            </div>
            {profile.email && (
              <p className="text-sm text-gray-500 truncate mt-1">
                {profile.email}
              </p>
            )}
            {memberSince && (
              <p className="text-xs text-gray-400 mt-1">
                Member since {memberSince}
              </p>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3 mt-6">
                <span aria-hidden="true">⚠</span>
                <p>{error}</p>
              </div>
            )}

            <dl className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-gray-50/60">
                <dt className="text-xs text-gray-400">Full name</dt>
                <dd className="text-sm font-medium mt-1.5 truncate">
                  {profile.full_name}
                </dd>
              </div>
              <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-gray-50/60">
                <dt className="text-xs text-gray-400">Phone number</dt>
                <dd className="text-sm font-medium mt-1.5 truncate">
                  {profile.phone || "—"}
                </dd>
              </div>
              <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-gray-50/60">
                <dt className="text-xs text-gray-400">Email</dt>
                <dd className="text-sm font-medium mt-1.5 truncate">
                  {profile.email || "—"}
                </dd>
              </div>
              <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-gray-50/60">
                <dt className="text-xs text-gray-400">Account type</dt>
                <dd className="text-sm font-medium mt-1.5 capitalize truncate">
                  {profile.role}
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-3 pt-8">
              <button
                onClick={handleLogout}
                className="text-red-500 px-5 py-2.5 rounded-md font-bold text-sm cursor-pointer hover:bg-red-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}