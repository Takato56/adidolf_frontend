import { fetchWithAuth } from '@/lib/auth';
import { Address } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiAddress {
  address_id: number;
  user_id: number;
  recipient_name: string;
  phone: string;
  is_default: boolean;
  address_details: string;
}

interface ApiEnvelope<T> {
  status: string;
  data: T;
}

// The backend stores an address as ONE free-text column (address_details),
// not separate province/district/ward columns like the frontend's Address
// type expects. This is a best-effort mapping, not a real fix: on read, the
// whole string goes into street_detail (province/district/ward left blank);
// on write, whatever's in the separate fields gets joined back into one
// string. If the backend ever adds real columns for these, this mapping
// should be deleted in favor of sending them directly.
function toFrontendAddress(a: ApiAddress): Address {
  return {
    id: a.address_id,
    recipient_name: a.recipient_name,
    phone: a.phone,
    province: '',
    district: '',
    ward: '',
    street_detail: a.address_details,
    is_default: a.is_default ? 1 : 0,
  };
}

function toAddressDetails(a: Partial<Address>): string {
  return [a.street_detail, a.ward, a.district, a.province].filter(Boolean).join(', ');
}

async function unwrap<T>(res: Response, fallbackMessage: string): Promise<T> {
  if (!res.ok) {
    let message = fallbackMessage;
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // ignore
    }
    throw new Error(`${message} (${res.status})`);
  }
  const json: ApiEnvelope<T> = await res.json();
  return json.data;
}

export async function getAddressesByUserId(userId: number): Promise<Address[]> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/addresses?user_id=${userId}`);
  const data = await unwrap<ApiAddress[]>(res, 'Failed to fetch addresses');
  return data.map(toFrontendAddress);
}

export async function createAddressApi(
  userId: number,
  address: Partial<Address>
): Promise<Address> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/addresses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      user_id: userId,
      recipient_name: address.recipient_name,
      phone: address.phone,
      is_default: !!address.is_default,
      address_details: toAddressDetails(address),
    }),
  });
  const data = await unwrap<ApiAddress>(res, 'Failed to create address');
  return toFrontendAddress(data);
}

export async function updateAddressApi(
  id: number,
  address: Partial<Address>
): Promise<Address> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/addresses/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(address.recipient_name !== undefined ? { recipient_name: address.recipient_name } : {}),
      ...(address.phone !== undefined ? { phone: address.phone } : {}),
      ...(address.is_default !== undefined ? { is_default: !!address.is_default } : {}),
      address_details: toAddressDetails(address),
    }),
  });
  const data = await unwrap<ApiAddress>(res, 'Failed to update address');
  return toFrontendAddress(data);
}

export async function deleteAddressApi(id: number): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/addresses/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete address (${res.status})`);
  }
}

// Reconciles a user's addresses with whatever's currently in the edit form:
// anything with an id no longer present gets deleted, anything without an id
// (or with an id we don't recognize) gets created, everything else updated.
export async function syncUserAddresses(
  userId: number,
  desired: Partial<Address>[]
): Promise<Address[]> {
  const current = await getAddressesByUserId(userId);
  const currentIds = new Set(current.map((a) => a.id));

  const toUpdate = desired.filter((a) => a.id && currentIds.has(a.id));
  const toCreate = desired.filter((a) => !a.id || !currentIds.has(a.id));
  const desiredIds = new Set(toUpdate.map((a) => a.id));
  const toDelete = current.filter((a) => !desiredIds.has(a.id));

  await Promise.all(toDelete.map((a) => deleteAddressApi(a.id)));
  await Promise.all(toUpdate.map((a) => updateAddressApi(a.id as number, a)));
  await Promise.all(toCreate.map((a) => createAddressApi(userId, a)));

  return getAddressesByUserId(userId);
}