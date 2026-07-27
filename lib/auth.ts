const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
  if (!res.ok) throw new Error(`Registration Failed (${res.status})`);
  const json = await res.json();
  console.log(json);
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // required so the browser stores the httpOnly refreshToken cookie set by the backend (cross-origin)
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Login Failed (${res.status})`);
  const json = await res.json();
  sessionStorage.setItem("accessToken", json.data.accessToken);
  sessionStorage.setItem("userName", json.data.user.full_name);
  sessionStorage.setItem("userRole", json.data.user.role);
  window.dispatchEvent(new Event("authchange"));
  console.log(json);
}

export async function logoutUser() {
  try {
    await fetchWithAuth(`${BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include", // required so the browser actually sends the refreshToken cookie to be cleared server-side
    });
  } catch {
    // Best-effort — if the server call fails (e.g. refresh token also
    // expired), still clear local state below so the user ends up logged
    // out client-side either way.
  } finally {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userRole");
    window.dispatchEvent(new Event("authchange"));
  }
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });

  if (res.status === 401) {
    // Access token expired (or missing) — try a silent refresh.
    const res_refresh = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // required so the browser sends the refreshToken cookie
    });
    if (!res_refresh.ok) {
      // Well nothing we can do now lol.
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("userName");
      sessionStorage.removeItem("userRole");
      throw new Error(`Refresh failed ${res_refresh.status}`);
    }

    const json = await res_refresh.json();
    sessionStorage.setItem("accessToken", json.data.accessToken);
    return fetchWithAuth(url, options); // Retrying......
  }

  return res;
}