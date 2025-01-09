import { create } from 'zustand';

export interface ProductType {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductsStore {
  products: ProductType[];
  increaseStock: (id: string, quantity?: number) => void;
  decreaseStock: (id: string) => void;
  suggestPrice: (id: string) => void;
}

export const useProductsStore = create<ProductsStore>((set) => ({
  products: [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ],
  increaseStock: (id: string, quantity: number = 1) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id
          ? { ...product, stock: product.stock + quantity }
          : product
      ),
    }));
  },
  decreaseStock: (id: string) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, stock: product.stock - 1 } : product
      ),
    }));
  },
  suggestPrice: (id: string) => {
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id
          ? { ...product, price: product.price * 0.95 }
          : product
      ),
    }));
  },
}));
