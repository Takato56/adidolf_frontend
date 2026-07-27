import { fetchWithAuth } from '@/lib/auth';
import { Voucher } from '@/types';
import { isTestEntry } from '@/lib/utils/testData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiVoucher {
  voucher_id: number;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  max_discount: number | null;
  min_order_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  valid_from: string;
  valid_to: string;
  is_active: boolean;
  target_user_id: number | null;
}

export interface ApiVoucherEvaluation {
  valid: boolean;
  discount_amount: number;
  reason: string | null;
}

interface ApiEnvelope<T> {
  status: string;
  data: T;
}

function toFrontendVoucher(v: ApiVoucher): Voucher {
  return {
    id: v.voucher_id,
    code: v.code,
    discount_type: v.discount_type,
    discount_value: v.discount_value,
    max_discount: v.max_discount,
    min_order_amount: v.min_order_amount,
    usage_limit: v.usage_limit,
    usage_count: v.used_count,
    valid_from: v.valid_from,
    valid_to: v.valid_to,
    is_active: v.is_active,
  };
}

async function unwrap<T>(res: Response, fallbackMessage: string): Promise<T> {
  if (!res.ok) {
    let message = fallbackMessage;
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // ignore parse errors
    }
    throw new Error(`${message} (${res.status})`);
  }
  const json: ApiEnvelope<T> = await res.json();
  return json.data;
}

// ---------- Customer-facing Voucher Validation ----------

export async function validateVoucherApi(code: string): Promise<ApiVoucherEvaluation> {
  const res = await fetchWithAuth(`${BASE_URL}/vouchers/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  return unwrap<ApiVoucherEvaluation>(res, 'Failed to validate voucher');
}

// ---------- Admin-only Voucher Management ----------

export async function getVouchersApi(): Promise<Voucher[]> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/vouchers`);
  const data = await unwrap<ApiVoucher[]>(res, 'Failed to fetch vouchers');
  return data.filter((v) => !isTestEntry(v.code)).map(toFrontendVoucher);
}

export async function getVoucherByIdApi(id: number): Promise<Voucher> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/vouchers/${id}`);
  const data = await unwrap<ApiVoucher>(res, 'Failed to fetch voucher');
  if (isTestEntry(data.code)) {
    throw new Error('Voucher not found (404)');
  }
  return toFrontendVoucher(data);
}

export async function createVoucherApi(voucher: Omit<Voucher, 'id'>): Promise<Voucher> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/vouchers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      code: voucher.code,
      discount_type: voucher.discount_type,
      discount_value: voucher.discount_value,
      max_discount: voucher.max_discount,
      min_order_amount: voucher.min_order_amount,
      usage_limit: voucher.usage_limit,
      used_count: voucher.usage_count,
      valid_from: voucher.valid_from,
      valid_to: voucher.valid_to,
      is_active: voucher.is_active,
    }),
  });
  const data = await unwrap<ApiVoucher>(res, 'Failed to create voucher');
  return toFrontendVoucher(data);
}

export async function updateVoucherApi(
  id: number,
  updates: Partial<Omit<Voucher, 'id'>>
): Promise<Voucher> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/vouchers/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...(updates.code !== undefined ? { code: updates.code } : {}),
      ...(updates.discount_type !== undefined ? { discount_type: updates.discount_type } : {}),
      ...(updates.discount_value !== undefined ? { discount_value: updates.discount_value } : {}),
      ...(updates.max_discount !== undefined ? { max_discount: updates.max_discount } : {}),
      ...(updates.min_order_amount !== undefined
        ? { min_order_amount: updates.min_order_amount }
        : {}),
      ...(updates.usage_limit !== undefined ? { usage_limit: updates.usage_limit } : {}),
      ...(updates.usage_count !== undefined ? { used_count: updates.usage_count } : {}),
      ...(updates.valid_from !== undefined ? { valid_from: updates.valid_from } : {}),
      ...(updates.valid_to !== undefined ? { valid_to: updates.valid_to } : {}),
      ...(updates.is_active !== undefined ? { is_active: updates.is_active } : {}),
    }),
  });
  const data = await unwrap<ApiVoucher>(res, 'Failed to update voucher');
  return toFrontendVoucher(data);
}

export async function deleteVoucherApi(id: number): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/vouchers/${id}`, { method: 'DELETE' });
  if (!res.ok && res.status !== 204) {
    let message = 'Failed to delete voucher';
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // ignore
    }
    throw new Error(`${message} (${res.status})`);
  }
}