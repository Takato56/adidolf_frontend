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
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Add New Voucher
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Create a new discount code or promotion
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <VoucherForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
