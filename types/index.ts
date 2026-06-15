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

export interface Product {
  id: string;
  name: string;
  sku: string;
  categorySlug: string;
  price: number;
  stock: number;
  imageUrl: string;
  attributes: string; // e.g. "Size: L / Noir Edition"
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
