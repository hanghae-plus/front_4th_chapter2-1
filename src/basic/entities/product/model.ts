import { createStore } from "@basic/shared/lib";

export interface Product {
  id: string;
  name: string;
  cost: number;
  quantity: number;
}

interface ProductStore {
  products: Product[];
  updateProductQuantity: (productId: string, delta: number) => void;
}

const products: Product[] = [
  { id: "p1", name: "상품1", cost: 10000, quantity: 50 },
  { id: "p2", name: "상품2", cost: 20000, quantity: 30 },
  { id: "p3", name: "상품3", cost: 30000, quantity: 20 },
  { id: "p4", name: "상품4", cost: 15000, quantity: 0 },
  { id: "p5", name: "상품5", cost: 25000, quantity: 10 }
];

export const productStore = createStore<ProductStore>((set, get) => ({
  products,
  updateProductQuantity: (productId, delta) => {
    const { products } = get();
    const product = products.find((product) => product.id === productId);

    if (!product) return;

    if (product.quantity + delta < 0) {
      return;
    }

    set((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === productId
          ? { ...product, quantity: product.quantity + delta }
          : product
      )
    }));
  }
}));
