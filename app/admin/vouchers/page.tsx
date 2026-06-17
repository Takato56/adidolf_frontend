'use client';

import { VoucherTable } from '@/components/admin/VoucherTable';
import { useVouchers } from '@/lib/hooks/useVouchers';
import { FiPlus } from 'react-icons/fi';
import Link from 'next/link';

export default function VouchersPage() {
  const { vouchers, isLoaded } = useVouchers();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading vouchers...</div>
      </div>
    );
  }

  const activeCount = vouchers.filter((v) => {
    const now = new Date();
    const validFrom = new Date(v.valid_from);
    const validTo = new Date(v.valid_to);
    const limitReached =
      v.usage_limit !== null && v.usage_count >= v.usage_limit;
    return (
      v.is_active && now >= validFrom && now <= validTo && !limitReached
    );
  }).length;

  const percentCount = vouchers.filter(
    (v) => v.discount_type === 'percent'
  ).length;
  const fixedCount = vouchers.filter(
    (v) => v.discount_type === 'fixed'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vouchers</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage discount codes and promotions
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/vouchers/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus size={18} />
            Add Voucher
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Total Vouchers</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {vouchers.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Active Now</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {activeCount}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">Types</p>
          <p className="text-lg font-bold text-gray-900 mt-2">
            <span className="text-blue-600">{percentCount}%</span>{' '}
            <span className="text-gray-400">/</span>{' '}
            <span className="text-green-600">${fixedCount} fixed</span>
          </p>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <VoucherTable vouchers={vouchers} />
      </div>
    </div>
  );
}
