export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  description: string;
  trending?: boolean;
  exclusive?: boolean;
  soldOutRate?: string; // e.g. "94%"
  tagline?: string;
}

export interface ProductVariant {
  id?: string;
  color?: string;
  size?: string;
  extra_price: number;
  stock: number;
  image_url?: string;
}

export interface Product {
  id: string;
  name: string;
  categorySlug: string;
  slug: string;
  description: string;
  price: number;
  brand: string;
  isPublished: boolean;
  variants: ProductVariant[];
  images: string[];
}

export interface OverviewStats {
  totalSales: number;
  totalOrders: number;
  activeCustomers: number;
  revenueGrowth: string; // e.g. "+12.5%"
  salesTrend: number[];
  ordersTrend: number[];
  customersTrend: number[];
  revenueTrend: number[];
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'done' | 'cancelled';

export interface OrderItem {
  id: number;
  productId: number;
  variantId: number | null;
  productName: string;
  variantInfo: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  addressId: number;
  voucherId: number;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalPrice: number;
  note: string;
  createdAt: string; // ISO date string
  items: OrderItem[];
}

export type UserRole = 'customer' | 'admin';

export interface Address {
  id: number;
  recipient_name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street_detail: string;
  is_default: number; // 0 or 1
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  password_hash: string;
  role: UserRole;
  is_active: number; // 0 or 1
  created_at: string; // ISO date string
  addresses: Address[];
}
