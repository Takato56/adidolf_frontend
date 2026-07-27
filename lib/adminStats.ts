// FILE: takato56-adidolf_frontend/lib/adminStats.ts

import { fetchWithAuth } from '@/lib/auth';
import { OverviewStats } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiEnvelope<T> {
  status: string;
  data: T;
}

export async function getAdminOverviewStatsApi(): Promise<OverviewStats> {
  const res = await fetchWithAuth(`${BASE_URL}/admin/stats/overview`);
  if (!res.ok) {
    let message = 'Failed to fetch overview stats';
    try {
      const body = await res.json();
      message = body?.message || message;
    } catch {
      // ignore
    }
    throw new Error(`${message} (${res.status})`);
  }
  const json: ApiEnvelope<OverviewStats> = await res.json();
  return json.data;
}