'use client';

import { Voucher } from '@/types';
import { VoucherActions } from './VoucherActions';
import Link from 'next/link';

interface VoucherTableProps {
  vouchers: Voucher[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString();
}

export function VoucherTable({ vouchers }: VoucherTableProps) {
  if (!vouchers || vouchers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No vouchers found.{' '}
        <Link
          href="/admin/vouchers/new"
          className="text-blue-600 hover:underline"
        >
          Add one now
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Code
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Type
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Value
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Max Discount
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Min Order
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Usage
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Valid Period
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {vouchers.map((voucher) => (
            <tr
              key={voucher.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-900 font-mono font-medium">
                {voucher.code}
              </td>
              <td className="px-6 py-4 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    voucher.discount_type === 'percent'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {voucher.discount_type === 'percent' ? 'Percent' : 'Fixed'}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                {voucher.discount_type === 'percent'
                  ? `${voucher.discount_value}%`
                  : `$${voucher.discount_value.toFixed(2)}`}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {voucher.max_discount !== null
                  ? `$${voucher.max_discount.toFixed(2)}`
                  : '—'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {voucher.min_order_amount !== null
                  ? `$${voucher.min_order_amount.toFixed(2)}`
                  : '—'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <span className={voucher.usage_limit !== null && voucher.usage_count >= voucher.usage_limit ? 'text-red-600 font-medium' : ''}>
                  {voucher.usage_count}
                  {voucher.usage_limit !== null
                    ? ` / ${voucher.usage_limit}`
                    : ''}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <div>{formatDate(voucher.valid_from)}</div>
                <div className="text-gray-400">to {formatDate(voucher.valid_to)}</div>
              </td>
              <td className="px-6 py-4 text-sm">
                {(() => {
                  const now = new Date();
                  const validFrom = new Date(voucher.valid_from);
                  const validTo = new Date(voucher.valid_to);
                  const isExpired = now > validTo;
                  const isNotStarted = now < validFrom;
                  const isLimitReached =
                    voucher.usage_limit !== null &&
                    voucher.usage_count >= voucher.usage_limit;

                  if (!voucher.is_active) {
                    return (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        Inactive
                      </span>
                    );
                  }
                  if (isExpired) {
                    return (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Expired
                      </span>
                    );
                  }
                  if (isNotStarted) {
                    return (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        Scheduled
                      </span>
                    );
                  }
                  if (isLimitReached) {
                    return (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        Limit Reached
                      </span>
                    );
                  }
                  return (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  );
                })()}
              </td>
              <td className="px-6 py-4 text-sm">
                <VoucherActions voucherId={voucher.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
