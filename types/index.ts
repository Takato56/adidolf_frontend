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
  name: string;
  price: number;
  stock: number;
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
