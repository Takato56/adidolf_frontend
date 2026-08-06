// FILE: takato56-adidolf_frontend/app/admin/vouchers/page.tsx

'use client';

import { VoucherTable } from '@/components/admin/VoucherTable';
import { useVouchers } from '@/lib/hooks/useVouchers';
import { exportToCsv } from '@/lib/utils/export';
import { FiPlus, FiDownload } from 'react-icons/fi';
import Link from 'next/link';

export default function VouchersPage() {
  const { vouchers, isLoaded, error } = useVouchers();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading vouchers...</div>
      </div>
    );
  }

  const handleExportVouchers = () => {
    const formattedData = vouchers.map((v) => ({
      'Voucher ID': v.id,
      'Code': v.code,
      'Discount Type': v.discount_type,
      'Discount Value': v.discount_value,
      'Max Discount ($)': v.max_discount ?? 'Unlimited',
      'Min Order ($)': v.min_order_amount ?? 0,
      'Usage Count': v.usage_count,
      'Usage Limit': v.usage_limit ?? 'Unlimited',
      'Valid From': new Date(v.valid_from).toLocaleDateString(),
      'Valid To': new Date(v.valid_to).toLocaleDateString(),
      'Status': v.is_active ? 'Active' : 'Inactive',
    }));

    exportToCsv('adidolf_vouchers_export', formattedData);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vouchers</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage discount codes and promotions
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleExportVouchers}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer font-medium text-sm"
          >
            <FiDownload size={18} />
            Export CSV
          </button>
          <Link
            href="/admin/vouchers/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            <FiPlus size={18} />
            Add Voucher
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          Couldn't load vouchers: {error}
        </div>
      )}

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
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <VoucherTable vouchers={vouchers} />
      </div>
    </div>
  );
}