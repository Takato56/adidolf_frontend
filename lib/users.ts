import { fetchWithAuth } from '@/lib/auth';
import { User } from '@/types';
import { isTestEntry } from '@/lib/utils/testData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiUser {
  user_id: number;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'customer' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

interface ApiEnvelope<T> {
  status: string;
  data: T;
}

// Addresses aren't included here — they're a separate resource
// (/admin/addresses) fetched/synced via lib/api/addresses.ts.
function toFrontendUser(u: ApiUser): User {
  return {
    id: u.user_id,
    email: u.email,
    full_name: u.full_name,
    phone: u.phone ?? '',
    avatar_url: u.avatar_url ?? '',
    password_hash: '', // never fetched or edited from the client
    role: u.role,
    is_active: u.is_active ? 1 : 0,
    created_at: u.created_at,
    addresses: [],
  };
}

async function unwrap<T>(res: Response, fallbackMessage: string): Promise<T> {
  if (!res.ok) {
    let message = fallbackMessage;
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // ignore body parse errors
    }
    throw new Error(`${message} (${res.status})`);
  }
  const json: ApiEnvelope<T> = await res.json();
  return json.data;
}

// All /admin/* routes require auth + admin role (enforced server-side).

export async function getUsersApi(): Promise<User[]> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/users`);
  const data = await unwrap<ApiUser[]>(res, 'Failed to fetch users');
  return data
    .filter((u) => !isTestEntry(u.full_name) && !isTestEntry(u.email))
    .map(toFrontendUser);
}

export async function getUserByIdApi(id: number): Promise<User> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/users/${id}`);
  const data = await unwrap<ApiUser>(res, 'Failed to fetch user');
  if (isTestEntry(data.full_name) || isTestEntry(data.email)) {
    throw new Error('User not found (404)');
  }
  return toFrontendUser(data);
}

// Note: role/full_name/phone/avatar_url/email/is_active only — password_hash
// is deliberately never sent from here. The generic CRUD endpoint inserts
// whatever it's given verbatim (no hashing), so a client-supplied value
// would either break the user's login or store a real password unhashed.
export async function updateUserApi(
  id: number,
  updates: Partial<Omit<User, 'id' | 'addresses' | 'password_hash' | 'created_at'>>
): Promise<User> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(updates.email !== undefined ? { email: updates.email } : {}),
      ...(updates.full_name !== undefined ? { full_name: updates.full_name } : {}),
      ...(updates.phone !== undefined ? { phone: updates.phone || undefined } : {}),
      ...(updates.avatar_url !== undefined ? { avatar_url: updates.avatar_url || undefined } : {}),
      ...(updates.role !== undefined ? { role: updates.role } : {}),
      ...(updates.is_active !== undefined ? { is_active: !!updates.is_active } : {}),
    }),
  });
  const data = await unwrap<ApiUser>(res, 'Failed to update user');
  return toFrontendUser(data);
}

export async function deleteUserApi(id: number): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/users/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    let message = 'Failed to delete user';
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // ignore
    }
    throw new Error(`${message} (${res.status})`);
  }
}