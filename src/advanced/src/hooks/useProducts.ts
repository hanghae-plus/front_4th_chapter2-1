import { useState, useCallback } from 'react';
import { Product } from '../types';

export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const updateQuantity = useCallback((id: string, change: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, quantity: product.quantity + change } : product,
      ),
    );
  }, []);

  return { products, updateQuantity };
};
