const BASE_URL = process.env.API_URL;

export async function registerUser(data: {
    email: string,
    password: string,
    full_name: string,
    phone: string
}) {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? "Registration Failed");
    return json.data;
}

export async function loginUser(data: {
    email: string,
    password: string
}) {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message ?? "Login Failed");
    return json.data;
}

export async function logoutUser() {
    await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include"
    });
}

export async function fetchWithAuth(
    url: string,
    options: RequestInit = {}
) {
    // todo
}