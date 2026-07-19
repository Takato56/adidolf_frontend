import { Voucher } from '@/types';

export interface VoucherEvaluation {
  eligible: boolean;
  reason?: string;
  discountAmount: number;
}

// Applies the voucher's own rules (active window, usage limit, min order,
// max discount cap) against a given subtotal. Pure function — no network
// calls — so it can be reused anywhere a "what would this voucher do"
// preview is needed.
export function evaluateVoucher(voucher: Voucher, subtotal: number): VoucherEvaluation {
  const now = new Date();
  const validFrom = new Date(voucher.valid_from);
  const validTo = new Date(voucher.valid_to);

  if (!voucher.is_active) {
    return { eligible: false, reason: 'This voucher is no longer active.', discountAmount: 0 };
  }
  if (now < validFrom) {
    return { eligible: false, reason: 'This voucher is not active yet.', discountAmount: 0 };
  }
  if (now > validTo) {
    return { eligible: false, reason: 'This voucher has expired.', discountAmount: 0 };
  }
  if (voucher.usage_limit !== null && voucher.usage_count >= voucher.usage_limit) {
    return {
      eligible: false,
      reason: 'This voucher has reached its usage limit.',
      discountAmount: 0,
    };
  }
  if (voucher.min_order_amount !== null && subtotal < voucher.min_order_amount) {
    return {
      eligible: false,
      reason: `Add $${(voucher.min_order_amount - subtotal).toFixed(2)} more to use this voucher (min order $${voucher.min_order_amount.toFixed(2)}).`,
      discountAmount: 0,
    };
  }

  let discount =
    voucher.discount_type === 'percent'
      ? subtotal * (voucher.discount_value / 100)
      : voucher.discount_value;

  if (voucher.max_discount !== null) {
    discount = Math.min(discount, voucher.max_discount);
  }
  discount = Math.min(discount, subtotal); // never discount more than the order itself

  return { eligible: true, discountAmount: discount };
}