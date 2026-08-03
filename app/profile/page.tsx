// FILE: takato56-adidolf_frontend/app/profile/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { fetchWithAuth, logoutUser, getUserSession } from "@/lib/auth";
import { updateMyProfileApi, changePasswordApi } from "@/lib/users";
import { getMyAddressesApi, createCustomerAddressApi, deleteAddressApi } from "@/lib/addresses";
import { getMyOrdersApi } from "@/lib/orders";
import { Order, Address } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Profile {
  full_name: string;
  email: string;
  phone: string;
  role: string;
  created_at?: string;
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

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipping: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Address Modal / Adding State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipient_name: "",
    phone: "",
    street_detail: "",
  });
  const [addressSaving, setAddressSaving] = useState(false);

  // Password Change State
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    const session = getUserSession();
    if (!session) {
      router.push("/login");
      return;
    }

    const sessionName = session.name;
    const sessionRole = session.role;

    async function loadData() {
      try {
        const res = await fetchWithAuth(`${BASE_URL}/user/me`);
        if (res.ok) {
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
        } else {
          setProfile({
            full_name: sessionName,
            email: "",
            phone: "",
            role: sessionRole,
          });
        }
      } catch (err) {
        console.error(err);
        setProfile({
          full_name: sessionName,
          email: "",
          phone: "",
          role: sessionRole,
        });
      } finally {
        setLoading(false);
      }

      // Load Addresses
      try {
        const myAddrs = await getMyAddressesApi();
        setAddresses(myAddrs);
      } catch (err) {
        console.warn("Could not load addresses:", err);
      }

      // Load Orders
      try {
        const myOrders = await getMyOrdersApi();
        setOrders(myOrders);
      } catch (err) {
        console.warn("Could not load orders:", err);
      }
    }

    loadData();
  }, [router]);

  async function handleSaveProfile() {
    if (!profile) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const updated = await updateMyProfileApi({
        full_name: fullName.trim(),
        phone: phone.trim(),
      });

      setProfile((prev) =>
        prev ? { ...prev, full_name: updated.full_name, phone: updated.phone } : prev
      );

      // Synchronize with active storage type (Keep Me Signed In vs Session)
      const isPersistent = localStorage.getItem("keepSignedIn") === "true";
      const storage = isPersistent ? localStorage : sessionStorage;
      storage.setItem("userName", updated.full_name);

      window.dispatchEvent(new Event("authchange"));
      setSaveSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!newAddress.recipient_name.trim() || !newAddress.street_detail.trim()) return;

    setAddressSaving(true);
    try {
      const created = await createCustomerAddressApi({
        recipient_name: newAddress.recipient_name.trim(),
        phone: newAddress.phone.trim(),
        street_detail: newAddress.street_detail.trim(),
      });
      setAddresses((prev) => [created, ...prev]);
      setNewAddress({ recipient_name: "", phone: "", street_detail: "" });
      setShowAddressForm(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add address");
    } finally {
      setAddressSaving(false);
    }
  }

  async function handleDeleteAddress(id: number) {
    if (!confirm("Are you sure you want to delete this saved address?")) return;
    try {
      await deleteAddressApi(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete address");
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordData.new_password.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }

    setPasswordSaving(true);
    try {
      await changePasswordApi(passwordData);
      setPasswordSuccess("Password changed successfully!");
      setPasswordData({ old_password: "", new_password: "" });
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setPasswordSaving(false);
    }
  }

  async function handleLogout() {
    await logoutUser();
    window.dispatchEvent(new Event("authchange"));
    router.push("/");
  }

  if (loading) {
    return (
      <div className="margindiv mt-6 mb-10 text-center py-20 text-gray-400">
        Loading profile...
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
              <Link href="/" className="hover:underline">Home</Link>
            </li>
            <li className="text-gray-700 text-sm">&gt;</li>
            <li>
              <span className="text-black font-medium">Profile</span>
            </li>
          </ul>
        </nav>
      </div>

      <div className="texttitle margindiv pt-4">
        <p>My Account & Settings</p>
        <p className="subtitle pt-1">Manage profile information, saved addresses, and order history</p>
      </div>

      <div className="margindiv mt-6 mb-10 space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-28 md:h-40 bg-black relative">
            <div
              className={`absolute -bottom-10 md:-bottom-12 left-6 md:left-10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold uppercase ring-4 ring-white ${
                isAdmin ? "bg-black text-white" : "bg-gray-100 text-black"
              }`}
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
                <span className="text-xs bg-black text-white font-medium px-2.5 py-0.5 rounded-full shrink-0">
                  Admin
                </span>
              )}
            </div>
            {profile.email && (
              <p className="text-sm text-gray-500 truncate mt-0.5">
                {profile.email}
              </p>
            )}
            {memberSince && (
              <p className="text-xs text-gray-400 mt-1">
                Member since {memberSince}
              </p>
            )}

            {saveSuccess && (
              <p className="text-xs text-green-700 font-semibold mt-3">{saveSuccess}</p>
            )}
            {passwordSuccess && (
              <p className="text-xs text-green-700 font-semibold mt-3">{passwordSuccess}</p>
            )}

            {!editing ? (
              <>
                <dl className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
                    <dt className="text-xs text-gray-400">Full name</dt>
                    <dd className="text-sm font-medium mt-1 truncate">{profile.full_name}</dd>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
                    <dt className="text-xs text-gray-400">Phone number</dt>
                    <dd className="text-sm font-medium mt-1 truncate">{profile.phone || "—"}</dd>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
                    <dt className="text-xs text-gray-400">Email</dt>
                    <dd className="text-sm font-medium mt-1 truncate">{profile.email || "—"}</dd>
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
                    <dt className="text-xs text-gray-400">Account type</dt>
                    <dd className="text-sm font-medium mt-1 capitalize truncate">{profile.role}</dd>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-3 pt-8">
                  <button
                    onClick={() => setEditing(true)}
                    className="bg-black text-white px-5 py-2.5 rounded-md font-bold text-sm hover:bg-gray-900 transition-colors cursor-pointer"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="bg-gray-100 text-gray-800 px-5 py-2.5 rounded-md font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    {showPasswordForm ? "Close Password Form" : "Change Password"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 px-5 py-2.5 rounded-md font-bold text-sm hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Log out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
                    <label className="text-xs text-gray-400" htmlFor="full_name">Full name</label>
                    <input
                      id="full_name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-transparent text-sm font-medium mt-1 outline-none border-b border-gray-300 focus:border-black pb-1"
                    />
                  </div>
                  <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/60">
                    <label className="text-xs text-gray-400" htmlFor="phone">Phone number</label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium mt-1 outline-none border-b border-gray-300 focus:border-black pb-1"
                    />
                  </div>
                </div>

                {saveError && (
                  <p className="text-xs text-red-600 mt-3">{saveError}</p>
                )}

                <div className="flex flex-wrap gap-3 pt-8">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-black text-white px-5 py-2.5 rounded-md font-bold text-sm hover:bg-gray-900 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    disabled={saving}
                    className="text-gray-500 px-5 py-2.5 rounded-md font-bold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}

            {/* Password Change Form */}
            {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="mt-8 pt-6 border-t border-gray-200 max-w-md space-y-4">
                <h3 className="font-bold text-sm text-gray-900">Change Password</h3>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Old Password</label>
                  <input
                    type="password"
                    value={passwordData.old_password}
                    onChange={(e) => setPasswordData((p) => ({ ...p, old_password: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">New Password (min 8 characters)</label>
                  <input
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData((p) => ({ ...p, new_password: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:border-black"
                  />
                </div>

                {passwordError && <p className="text-xs text-red-600">{passwordError}</p>}

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-neutral-800 disabled:opacity-50 cursor-pointer"
                >
                  {passwordSaving ? "Updating..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Saved Delivery Addresses */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Saved Delivery Addresses</h2>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-xs font-semibold bg-gray-100 text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition cursor-pointer"
            >
              {showAddressForm ? "Cancel" : "+ Add Address"}
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Recipient Name *"
                  value={newAddress.recipient_name}
                  onChange={(e) => setNewAddress((a) => ({ ...a, recipient_name: e.target.value }))}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress((a) => ({ ...a, phone: e.target.value }))}
                  required
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                />
              </div>
              <input
                type="text"
                placeholder="Street Address Details *"
                value={newAddress.street_detail}
                onChange={(e) => setNewAddress((a) => ({ ...a, street_detail: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
              <button
                type="submit"
                disabled={addressSaving}
                className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase cursor-pointer"
              >
                {addressSaving ? "Saving..." : "Save Address"}
              </button>
            </form>
          )}

          {addresses.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No saved addresses found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-gray-900">{addr.recipient_name}</p>
                      {addr.is_default === 1 && (
                        <span className="text-[10px] bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{addr.phone}</p>
                    <p className="text-xs text-gray-700 mt-1">{addr.street_detail}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-xs text-red-500 hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Customer Order History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">My Order History</h2>

          {orders.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl">
              <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
              <Link href="/" className="text-xs text-blue-600 font-semibold underline mt-2 inline-block">
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-xl p-5 bg-gray-50/50 hover:bg-white transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3 mb-3">
                    <div>
                      <span className="font-bold text-gray-900 text-sm">Order #{order.id}</span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                      <span className="font-extrabold text-sm text-red-600">
                        ${order.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 ? (
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-xs text-gray-700">
                          <div>
                            <span className="font-semibold text-gray-900">{item.productName}</span>
                            {item.variantInfo && (
                              <span className="text-gray-400 ml-2">({item.variantInfo})</span>
                            )}
                          </div>
                          <span>
                            {item.quantity} × ${item.unitPrice.toFixed(2)} = <strong>${item.subtotal.toFixed(2)}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Order details recorded</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}