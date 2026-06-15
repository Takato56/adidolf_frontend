import { Product } from '@/types';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'admin_products';

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    categorySlug: 'menswear',
    slug: 'premium-cotton-t-shirt',
    description: 'A comfortable cotton t-shirt perfect for everyday wear.',
    price: 29.99,
    brand: 'Nike',
    isPublished: true,
    variants: [
      { id: 'v1', name: 'Size M / Navy', price: 29.99, stock: 50 },
      { id: 'v2', name: 'Size L / Black', price: 29.99, stock: 95 },
    ],
    images: ['/images/tshirt.jpg'],
  },
  {
    id: '2',
    name: 'Classic Blue Denim Jeans',
    categorySlug: 'menswear',
    slug: 'classic-blue-denim-jeans',
    description: 'Premium denim jeans with a classic blue wash.',
    price: 79.99,
    brand: "Levi's",
    isPublished: true,
    variants: [
      { id: 'v3', name: 'Size 32 / Dark Blue', price: 79.99, stock: 40 },
      { id: 'v4', name: 'Size 34 / Light Blue', price: 79.99, stock: 47 },
    ],
    images: ['/images/jeans.jpg'],
  },
  {
    id: '3',
    name: 'Summer Casual Shorts',
    categorySlug: 'menswear',
    slug: 'summer-casual-shorts',
    description: 'Lightweight and breathable shorts for summer.',
    price: 39.99,
    brand: 'Adidas',
    isPublished: true,
    variants: [
      { id: 'v5', name: 'Size L / Khaki', price: 39.99, stock: 12 },
    ],
    images: ['/images/shorts.jpg'],
  },
  {
    id: '4',
    name: 'Elegant Formal Shirt',
    categorySlug: 'menswear',
    slug: 'elegant-formal-shirt',
    description: 'Crisp white formal shirt for business and special occasions.',
    price: 89.99,
    brand: 'Hugo Boss',
    isPublished: false,
    variants: [
      { id: 'v6', name: 'Size L / White', price: 89.99, stock: 3 },
      { id: 'v7', name: 'Size XL / White', price: 89.99, stock: 0 },
    ],
    images: ['/images/formal.jpg'],
  },
  {
    id: '5',
    name: 'Vintage Leather Jacket',
    categorySlug: 'menswear',
    slug: 'vintage-leather-jacket',
    description: 'A timeless leather jacket with a rugged vintage finish.',
    price: 199.99,
    brand: 'Schott',
    isPublished: true,
    variants: [
      { id: 'v8', name: 'Size M / Black', price: 199.99, stock: 15 },
      { id: 'v9', name: 'Size L / Brown', price: 199.99, stock: 10 },
    ],
    images: ['/images/jacket.jpg'],
  },
];

/**
 * Migrate old-format products (with sku/stock/imageUrl/attributes)
 * to the new format (with slug/description/brand/isPublished/variants/images).
 */
function migrateProduct(raw: any): Product {
  return {
    id: raw.id || Date.now().toString(),
    name: raw.name || '',
    categorySlug: raw.categorySlug || 'menswear',
    slug: raw.slug || '',
    description: raw.description || raw.attributes || '',
    price: typeof raw.price === 'number' ? raw.price : 0,
    brand: raw.brand || '',
    isPublished: typeof raw.isPublished === 'boolean' ? raw.isPublished : true,
    variants:
      Array.isArray(raw.variants) && raw.variants.length > 0
        ? raw.variants.map((v: any) => ({
            id: v.id || v.name || '',
            name: v.name || '',
            price: typeof v.price === 'number' ? v.price : 0,
            stock: typeof v.stock === 'number' ? v.stock : 0,
          }))
        : [
            {
              id: 'default',
              name: 'Default',
              price: typeof raw.price === 'number' ? raw.price : 0,
              stock: raw.stock ?? 0,
            },
          ],
    images:
      Array.isArray(raw.images) && raw.images.length > 0
        ? raw.images
        : raw.imageUrl
        ? [raw.imageUrl]
        : [''],
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const migrated = Array.isArray(parsed)
            ? parsed.map(migrateProduct)
            : defaultProducts;
          setProducts(migrated);
        } catch {
          setProducts(defaultProducts);
        }
      } else {
        setProducts(defaultProducts);
      }
      setIsLoaded(true);
    }
  }, []);

  // Persist to localStorage whenever products change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products, isLoaded]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const getProduct = (id: string) => {
    return products.find((p) => p.id === id);
  };

  return {
    products,
    isLoaded,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  };
}
