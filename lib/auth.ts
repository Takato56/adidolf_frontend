// FILE: takato56-adidolf_frontend/lib/auth.ts

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
}

export function getUserSession(): { name: string; role: string } | null {
  if (typeof window === "undefined") return null;
  const token = getAccessToken();
  const name = sessionStorage.getItem("userName") || localStorage.getItem("userName");
  const role = sessionStorage.getItem("userRole") || localStorage.getItem("userRole");
  if (!token || !name || !role) return null;
  return { name, role };
}

export async function registerUser(data: {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let message = "Registration Failed";
    try {
      const json = await res.json();
      message = json.message || message;
    } catch {
      // ignore
    }
    throw new Error(`${message}`);
  }
}

export async function loginUser(
  data: { email: string; password: string },
  keepSignedIn = false
) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let message = "Invalid email or password";
    try {
      const json = await res.json();
      message = json.message || message;
    } catch {
      // ignore
    }
    throw new Error(`${message}`);
  }

  const json = await res.json();

  // Clear previous session/local storage
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("userName");
  sessionStorage.removeItem("userRole");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userName");
  localStorage.removeItem("userRole");
  localStorage.removeItem("keepSignedIn");

  const storage = keepSignedIn ? localStorage : sessionStorage;
  storage.setItem("accessToken", json.data.accessToken);
  storage.setItem("userName", json.data.user.full_name);
  storage.setItem("userRole", json.data.user.role);

  if (keepSignedIn) {
    localStorage.setItem("keepSignedIn", "true");
  }

  window.dispatchEvent(new Event("authchange"));
}

export async function logoutUser() {
  try {
    await fetchWithAuth(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // Best effort
  } finally {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userRole");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("keepSignedIn");
    window.dispatchEvent(new Event("authchange"));
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getAccessToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    const res_refresh = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res_refresh.ok) {
      sessionStorage.clear();
      localStorage.clear();
      window.dispatchEvent(new Event("authchange"));
      throw new Error(`Refresh failed ${res_refresh.status}`);
    }

    const json = await res_refresh.json();
    const isPersistent = localStorage.getItem("keepSignedIn") === "true";
    const storage = isPersistent ? localStorage : sessionStorage;

    storage.setItem("accessToken", json.data.accessToken);
    return fetchWithAuth(url, options);
  }

  return res;
}