import { Category } from '@/types';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'admin_categories';

const defaultCategories: Category[] = [
  {
    id: '1',
    name: 'Menswear',
    slug: 'menswear',
    imageUrl: '/images/menswear.jpg',
    description: 'Premium clothing for men including shirts, trousers, jackets, and accessories.',
  },
  {
    id: '2',
    name: 'Womenswear',
    slug: 'womenswear',
    imageUrl: '/images/womenswear.jpg',
    description: 'Elegant and modern fashion for women featuring dresses, tops, and more.',
  },
  {
    id: '3',
    name: 'Accessories',
    slug: 'accessories',
    imageUrl: '/images/accessories.jpg',
    description: 'Complete your look with our curated selection of belts, bags, and jewelry.',
  },
  {
    id: '4',
    name: 'Footwear',
    slug: 'footwear',
    imageUrl: '/images/footwear.jpg',
    description: 'Stylish and comfortable shoes for every occasion.',
  },
];

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setCategories(JSON.parse(stored));
        } catch {
          setCategories(defaultCategories);
        }
      } else {
        setCategories(defaultCategories);
      }
      setIsLoaded(true);
    }
  }, []);

  // Persist to localStorage whenever categories change
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const getCategory = (id: string) => {
    return categories.find((c) => c.id === id);
  };

  return {
    categories,
    isLoaded,
    addCategory,
    updateCategory,
    deleteCategory,
    getCategory,
  };
}
