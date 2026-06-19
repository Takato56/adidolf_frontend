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

  const handleSubmit = (data: any) => {
    updateVoucher(voucherId, data);
    router.push('/admin/vouchers');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      deleteVoucher(voucherId);
      router.push('/admin/vouchers');
    }
  };

  if (!isLoaded || !voucher) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-muted">Loading...</div>
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
          <h2 className="text-2xl font-bold text-text-primary">
            Edit Voucher: {voucher.code}
          </h2>
          <p className="text-text-muted text-sm mt-1">
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

      <div className="bg-surface-elevated rounded-lg shadow-md border border-border p-6">
        <VoucherForm voucher={voucher} onSubmit={handleSubmit} />
      </div>

      {/* Voucher Preview */}
      <div className="bg-surface-elevated rounded-lg shadow-md border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-text-muted text-sm">Code</p>
            <p className="text-text-primary font-mono font-medium">
              {voucher.code}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Discount Type</p>
            <p className="text-text-primary font-medium">
              {voucher.discount_type === 'percent'
                ? 'Percentage'
                : 'Fixed Amount'}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Discount Value</p>
            <p className="text-text-primary font-medium">
              {voucher.discount_type === 'percent'
                ? `${voucher.discount_value}%`
                : `$${voucher.discount_value.toFixed(2)}`}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Max Discount</p>
            <p className="text-text-primary font-medium">
              {voucher.max_discount !== null
                ? `$${voucher.max_discount.toFixed(2)}`
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Min Order Amount</p>
            <p className="text-text-primary font-medium">
              {voucher.min_order_amount !== null
                ? `$${voucher.min_order_amount.toFixed(2)}`
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Usage Limit</p>
            <p className="text-text-primary font-medium">
              {voucher.usage_limit !== null ? voucher.usage_limit : 'Unlimited'}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Usage Count</p>
            <p className="text-text-primary font-medium">{voucher.usage_count}</p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Valid From</p>
            <p className="text-text-primary font-medium">
              {new Date(voucher.valid_from).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Valid To</p>
            <p className="text-text-primary font-medium">
              {new Date(voucher.valid_to).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-text-muted text-sm">Status</p>
            <p className="text-text-primary font-medium">
              {voucher.is_active ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
