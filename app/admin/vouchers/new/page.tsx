'use client';

import { VoucherForm } from '@/components/admin/VoucherForm';
import { useVouchers } from '@/lib/hooks/useVouchers';
import { useRouter } from 'next/navigation';

export default function NewVoucherPage() {
  const router = useRouter();
  const { addVoucher, isLoaded } = useVouchers();

  const handleSubmit = (data: any) => {
    addVoucher(data);
    router.push('/admin/vouchers');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text-primary">
          Add New Voucher
        </h2>
        <p className="text-text-muted text-sm mt-1">
          Create a new discount code or promotion
        </p>
      </div>

      <div className="bg-surface-elevated rounded-lg shadow-md border border-border p-6">
        <VoucherForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
