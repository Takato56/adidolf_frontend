import { Product } from '@/types';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'admin_products';

const defaultProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Cotton T-Shirt',
    sku: 'TS-001',
    categorySlug: 'menswear',
    price: 29.99,
    stock: 145,
    imageUrl: '/images/tshirt.jpg',
    attributes: 'Size: M / Color: Navy',
  },
  {
    id: '2',
    name: 'Classic Blue Denim Jeans',
    sku: 'DJ-002',
    categorySlug: 'menswear',
    price: 79.99,
    stock: 87,
    imageUrl: '/images/jeans.jpg',
    attributes: 'Size: 32 / Color: Dark Blue',
  },
  {
    id: '3',
    name: 'Summer Casual Shorts',
    sku: 'SH-003',
    categorySlug: 'menswear',
    price: 39.99,
    stock: 12,
    imageUrl: '/images/shorts.jpg',
    attributes: 'Size: L / Color: Khaki',
  },
  {
    id: '4',
    name: 'Elegant Formal Shirt',
    sku: 'FS-004',
    categorySlug: 'menswear',
    price: 89.99,
    stock: 3,
    imageUrl: '/images/formal.jpg',
    attributes: 'Size: L / Color: White',
  },
  {
    id: '5',
    name: 'Vintage Leather Jacket',
    sku: 'LJ-005',
    categorySlug: 'menswear',
    price: 199.99,
    stock: 25,
    imageUrl: '/images/jacket.jpg',
    attributes: 'Size: M / Color: Black',
  },
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setProducts(JSON.parse(stored));
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
