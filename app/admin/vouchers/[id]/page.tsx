'use client';

import { VoucherForm } from '@/components/admin/VoucherForm';
import { useVouchers } from '@/lib/hooks/useVouchers';
import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { Voucher } from '@/types';
import Link from 'next/link';

export default function VoucherDetailPage() {
  const router = useRouter();
  const params = useParams();
  const voucherId = parseInt(params.id as string) || 0;
  const { getVoucher, updateVoucher, deleteVoucher, isLoaded } =
    useVouchers();
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const found = getVoucher(voucherId);
      if (found) {
        setVoucher(found);
      } else {
        router.push('/admin/vouchers');
      }
    }
  }, [isLoaded, voucherId, getVoucher, router]);

  const handleSubmit = async (data: any) => {
    setActionError(null);
    setIsSubmitting(true);
    try {
      await updateVoucher(voucherId, data);
      router.push('/admin/vouchers');
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Failed to update voucher'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this voucher?')) return;

    setActionError(null);
    try {
      await deleteVoucher(voucherId);
      router.push('/admin/vouchers');
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Failed to delete voucher'
      );
    }
  };

  if (!isLoaded || !voucher) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link
            href="/admin/vouchers"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mb-2"
          >
            <FiArrowLeft size={16} />
            Back to Vouchers
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            Edit Voucher: {voucher.code}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Update voucher details
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
        >
          <FiTrash2 size={18} />
          Delete Voucher
        </button>
      </div>

      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {actionError}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <VoucherForm voucher={voucher} onSubmit={handleSubmit} isLoading={isSubmitting} />
      </div>

      {/* Voucher Preview */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-600 text-sm">Code</p>
            <p className="text-gray-900 font-mono font-medium">
              {voucher.code}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Discount Type</p>
            <p className="text-gray-900 font-medium">
              {voucher.discount_type === 'percent'
                ? 'Percentage'
                : 'Fixed Amount'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Discount Value</p>
            <p className="text-gray-900 font-medium">
              {voucher.discount_type === 'percent'
                ? `${voucher.discount_value}%`
                : `$${voucher.discount_value.toFixed(2)}`}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Max Discount</p>
            <p className="text-gray-900 font-medium">
              {voucher.max_discount !== null
                ? `$${voucher.max_discount.toFixed(2)}`
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Min Order Amount</p>
            <p className="text-gray-900 font-medium">
              {voucher.min_order_amount !== null
                ? `$${voucher.min_order_amount.toFixed(2)}`
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Usage Limit</p>
            <p className="text-gray-900 font-medium">
              {voucher.usage_limit !== null ? voucher.usage_limit : 'Unlimited'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Usage Count</p>
            <p className="text-gray-900 font-medium">{voucher.usage_count}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Valid From</p>
            <p className="text-gray-900 font-medium">
              {new Date(voucher.valid_from).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Valid To</p>
            <p className="text-gray-900 font-medium">
              {new Date(voucher.valid_to).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <p className="text-gray-900 font-medium">
              {voucher.is_active ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}