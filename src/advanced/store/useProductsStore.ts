import { create } from 'zustand';

export interface ProductType {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductsStore {
  products: ProductType[];
}

export const useProductsStore = create<ProductsStore>(() => ({
  products: [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ],
}));
