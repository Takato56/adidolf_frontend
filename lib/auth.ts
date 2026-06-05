const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function registerUser(data: {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Registration Failed (${res.status})`);
  const json = await res.json();
  console.log(json);
}

export async function loginUser(data: { email: string; password: string }) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Login Failed (${res.status})`);
  const json = await res.json();
  sessionStorage.setItem("accessToken", json.data.accessToken);
  console.log(json);
}

export async function logoutUser() {
  await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
  });
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  });

  if (!res.ok) {
    // Assuming the token expired first.
    const res_refresh = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
    });
    if (!res_refresh.ok)
      // Ok well nothing we can do about it lol.
      throw new Error(`Refresh failed ${res_refresh.status}`);

    const json = await res.json();
    sessionStorage.setItem("accessToken", json.data.accessToken);
    fetchWithAuth(url, options); // Retrying...;
  }

  return res;
}
