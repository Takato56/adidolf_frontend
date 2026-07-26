import { Voucher } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import {
  getVouchersApi,
  createVoucherApi,
  updateVoucherApi,
  deleteVoucherApi,
} from '@/lib/vouchers';

export function useVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await getVouchersApi();
      setVouchers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vouchers');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addVoucher = async (voucher: Omit<Voucher, 'id'>) => {
    const created = await createVoucherApi(voucher);
    setVouchers((prev) => [...prev, created]);
    return created;
  };

  const updateVoucher = async (id: number, updates: Partial<Voucher>) => {
    const updated = await updateVoucherApi(id, updates);
    setVouchers((prev) => prev.map((v) => (v.id === id ? updated : v)));
    return updated;
  };

  const deleteVoucher = async (id: number) => {
    await deleteVoucherApi(id);
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  };

  const getVoucher = (id: number) => vouchers.find((v) => v.id === id);

  return {
    vouchers,
    isLoaded,
    error,
    refetch: load,
    addVoucher,
    updateVoucher,
    deleteVoucher,
    getVoucher,
  };
}