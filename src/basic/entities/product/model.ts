import { createStore } from "@basic/shared/lib";

export interface Product {
  id: string;
  name: string;
  val: number;
  q: number;
}

interface ProductStore {
  products: Product[];
  selectedProductId: string;
  selectProduct: (productId: string) => void;
}

const products: Product[] = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 }
];

export const productStore = createStore<ProductStore>((set) => ({
  products,
  selectedProductId: products[0].id,
  selectProduct: (productId: string) => {
    set((prev) => ({ ...prev, selectedProductId: productId }));
  }
}));
