"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchWithAuth, logoutUser } from "@/lib/auth";
import { updateUserApi } from "@/lib/users";

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

// Pulls userId straight out of the access token, same trick used at
// checkout — the JWT payload is just base64, no request needed.
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

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

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
        const loaded = {
          full_name: data.full_name || sessionName,
          email: data.email ?? "",
          phone: data.phone ?? "",
          role: data.role || sessionRole,
          created_at: data.created_at,
        };
        setProfile(loaded);
        setFullName(loaded.full_name);
        setPhone(loaded.phone);
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
        setFullName(sessionName);
        setError("Couldn't load all of your account details.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  async function handleSave() {
    if (!profile) return;

    setSaving(true);
    setSaveError(null);

    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("Couldn't determine your account — try logging in again.");

      // There's no customer-facing "update my own profile" endpoint on the
      // backend — the only route that can update a users row is the
      // admin-only /admin/users/:id (see lib/api/users.ts). This will
      // succeed if you're logged in as admin, and fail with a clear
      // message otherwise.
      const updated = await updateUserApi(userId, {
        full_name: fullName,
        phone,
      });

      setProfile((prev) =>
        prev ? { ...prev, full_name: updated.full_name, phone: updated.phone } : prev
      );
      sessionStorage.setItem("userName", updated.full_name);
      window.dispatchEvent(new Event("authchange"));
      setEditing(false);
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "";
      const isAuthError = message.includes("(401)") || message.includes("(403)");
      setSaveError(
        isAuthError
          ? "Profile edits can't be saved by regular accounts yet — the backend only has an admin-only endpoint for updating users. Ask the backend team for a self-service profile-update route."
          : "Couldn't save your changes. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    if (profile) {
      setFullName(profile.full_name);
      setPhone(profile.phone ?? "");
    }
    setEditing(false);
    setSaveError(null);
  }

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
        <div className="subtitle pt-1">
          {editing ? "Edit your account details" : "View your account details"}
        </div>
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

            {saveError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3 mt-6">
                <span aria-hidden="true">⚠</span>
                <p>{saveError}</p>
              </div>
            )}

            {!editing ? (
              <>
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
                    onClick={() => setEditing(true)}
                    className="bg-black text-white px-5 py-2.5 rounded-md font-bold text-sm cursor-pointer hover:bg-gray-900 transition-colors"
                  >
                    Edit profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 px-5 py-2.5 rounded-md font-bold text-sm cursor-pointer hover:bg-red-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                  >
                    Log out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-gray-50/60">
                    <label className="text-xs text-gray-400" htmlFor="full_name">
                      Full name
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      pattern="^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ\s'\-]*$"
                      title="Name can only contain letters, spaces, hyphens, and apostrophes."
                      required
                      className="w-full bg-transparent text-sm font-medium mt-1.5 outline-none border-b border-gray-200 focus:border-black pb-1"
                    />
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-gray-50/60">
                    <label className="text-xs text-gray-400" htmlFor="phone">
                      Phone number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      pattern="[0-9\-+\s()]*"
                      title="Please enter a valid phone number (minimum 10 digits). You can include spaces, hyphens, and a leading + for country codes."
                      className="w-full bg-transparent text-sm font-medium mt-1.5 outline-none border-b border-gray-200 focus:border-black pb-1"
                    />
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-gray-50/60">
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-sm font-medium mt-1.5 truncate text-gray-400">
                      {profile.email || "—"}
                    </p>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 md:p-5 bg-gray-50/60">
                    <p className="text-xs text-gray-400">Account type</p>
                    <p className="text-sm font-medium mt-1.5 capitalize truncate text-gray-400">
                      {profile.role}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-8">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-black text-white px-5 py-2.5 rounded-md font-bold text-sm cursor-pointer hover:bg-gray-900 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={saving}
                    className="text-gray-500 px-5 py-2.5 rounded-md font-bold text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}