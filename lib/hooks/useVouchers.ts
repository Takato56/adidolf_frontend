import { Voucher, DiscountType } from '@/types';
import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'admin_vouchers';

const today = new Date().toISOString().split('T')[0];
const nextMonth = new Date();
nextMonth.setMonth(nextMonth.getMonth() + 1);
const nextMonthStr = nextMonth.toISOString().split('T')[0];

const defaultVouchers: Voucher[] = [
  {
    id: 1,
    code: 'WELCOME10',
    discount_type: 'percent',
    discount_value: 10,
    max_discount: 50,
    min_order_amount: 30,
    usage_limit: 100,
    usage_count: 12,
    valid_from: '2026-01-01',
    valid_to: '2026-12-31',
    is_active: true,
  },
  {
    id: 2,
    code: 'SAVE20',
    discount_type: 'fixed',
    discount_value: 20,
    max_discount: null,
    min_order_amount: 100,
    usage_limit: null,
    usage_count: 45,
    valid_from: '2026-06-01',
    valid_to: nextMonthStr,
    is_active: true,
  },
  {
    id: 3,
    code: 'SUMMER25',
    discount_type: 'percent',
    discount_value: 25,
    max_discount: 75,
    min_order_amount: null,
    usage_limit: 200,
    usage_count: 0,
    valid_from: today,
    valid_to: '2026-08-31',
    is_active: false,
  },
];

function migrateVoucher(raw: any): Voucher {
  return {
    id: typeof raw.id === 'number' ? raw.id : 0,
    code: raw.code || '',
    discount_type:
      raw.discount_type === 'percent' || raw.discount_type === 'fixed'
        ? raw.discount_type
        : 'percent',
    discount_value: typeof raw.discount_value === 'number' ? raw.discount_value : 0,
    max_discount:
      raw.max_discount === null || raw.max_discount === undefined
        ? null
        : typeof raw.max_discount === 'number'
        ? raw.max_discount
        : parseFloat(raw.max_discount) || null,
    min_order_amount:
      raw.min_order_amount === null || raw.min_order_amount === undefined
        ? null
        : typeof raw.min_order_amount === 'number'
        ? raw.min_order_amount
        : parseFloat(raw.min_order_amount) || null,
    usage_limit:
      raw.usage_limit === null || raw.usage_limit === undefined
        ? null
        : typeof raw.usage_limit === 'number'
        ? raw.usage_limit
        : parseInt(String(raw.usage_limit)) || null,
    usage_count: typeof raw.usage_count === 'number' ? raw.usage_count : 0,
    valid_from: raw.valid_from || today,
    valid_to: raw.valid_to || today,
    is_active:
      typeof raw.is_active === 'boolean'
        ? raw.is_active
        : raw.is_active === 1 || raw.is_active === '1'
        ? true
        : false,
  };
}

export function useVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const nextVoucherId = useRef(100);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      let parsedVouchers: Voucher[];
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          parsedVouchers = Array.isArray(parsed)
            ? parsed.map(migrateVoucher)
            : defaultVouchers;
        } catch {
          parsedVouchers = defaultVouchers;
        }
      } else {
        parsedVouchers = defaultVouchers;
      }
      nextVoucherId.current =
        Math.max(...parsedVouchers.map((v) => v.id), 0) + 1;
      setVouchers(parsedVouchers);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vouchers));
    }
  }, [vouchers, isLoaded]);

  const addVoucher = (voucher: Omit<Voucher, 'id'>) => {
    const newVoucher: Voucher = {
      ...voucher,
      id: nextVoucherId.current++,
    };
    setVouchers((prev) => [...prev, newVoucher]);
    return newVoucher;
  };

  const updateVoucher = (id: number, updates: Partial<Voucher>) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updates } : v))
    );
  };

  const deleteVoucher = (id: number) => {
    setVouchers((prev) => prev.filter((v) => v.id !== id));
  };

  const getVoucher = (id: number) => {
    return vouchers.find((v) => v.id === id);
  };

  return {
    vouchers,
    isLoaded,
    addVoucher,
    updateVoucher,
    deleteVoucher,
    getVoucher,
  };
}
