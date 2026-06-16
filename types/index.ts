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
  id: string;
  productId: string;
  variantId: string | null;
  productName: string;
  variantInfo: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  voucherId: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalPrice: number;
  note: string;
  createdAt: string; // ISO date string
  items: OrderItem[];
}
