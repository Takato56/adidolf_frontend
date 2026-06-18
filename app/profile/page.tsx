"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { fetchWithAuth, logoutUser } from "@/lib/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Profile {
  full_name: string;
  email: string;
  phone: string;
  role: string;
}

function getStoredSession() {
  if (typeof window === "undefined") return null;
  const token = sessionStorage.getItem("accessToken");
  const name = sessionStorage.getItem("userName");
  const role = sessionStorage.getItem("userRole");
  if (!token || !name || !role) return null;
  return { name, role };
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Editable field state, seeded once profile loads
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
        const json = await res.json();
        const user = json.data;
        setProfile(user);
        setFullName(user.full_name);
        setPhone(user.phone ?? "");
      } catch (err) {
        console.error(err);
        // Fall back to what we already have in session storage so the
        // page still renders something useful even if /users/me isn't
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

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);

    try {
      // NOTE: there's no controller/route wired up for this yet — user.model.ts
      // has an `update` method but user.controller.ts only exports `getProfile`.
      // This call will 404 until you add an update handler + route for it.
      const res = await fetchWithAuth(`${BASE_URL}/user/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, phone }),
      });
      const json = await res.json();
      const updated = json.data;

      setProfile(updated);
      sessionStorage.setItem("userName", updated.full_name);
      window.dispatchEvent(new Event("authchange"));
      setEditing(false);
    } catch (err) {
      console.error(err);
      setError("Couldn't save your changes. Please try again.");
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
    setError(null);
  }

  async function handleLogout() {
    await logoutUser();
    window.dispatchEvent(new Event("authchange"));
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) return null;

  const isAdmin = profile.role === "admin";

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
        <div className="subtitle pt-1">Manage your account</div>
      </div>

      <div className="margindiv mt-6 mb-10">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 max-w-2xl p-6 md:p-8">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
              <FaUser size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-lg truncate">{profile.full_name}</p>
              <div className="flex items-center gap-2 mt-1">
                {profile.email && (
                  <p className="text-sm text-gray-500 truncate">{profile.email}</p>
                )}
                {isAdmin && (
                  <span className="text-xs bg-black text-white font-medium px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-4">{error}</p>
          )}

          {!editing ? (
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-gray-400">Full name</p>
                <p className="text-sm font-medium mt-0.5">{profile.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone number</p>
                <p className="text-sm font-medium mt-0.5">
                  {profile.phone || "—"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-black text-white px-5 py-2.5 rounded-md font-bold text-sm cursor-pointer hover:bg-gray-900 transition-colors"
                >
                  Edit profile
                </button>
                <button
                  onClick={handleLogout}
                  className="text-red-500 px-5 py-2.5 rounded-md font-bold text-sm cursor-pointer hover:bg-red-50 transition-colors"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
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
                  className="border-2 p-3 mt-1 border-gray-300 rounded-md outline-none w-full"
                />
              </div>

              <div>
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
                  className="border-2 p-3 mt-1 border-gray-300 rounded-md outline-none w-full"
                />
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-black text-white px-5 py-2.5 rounded-md font-bold text-sm cursor-pointer hover:bg-gray-900 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="text-gray-500 px-5 py-2.5 rounded-md font-bold text-sm cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}