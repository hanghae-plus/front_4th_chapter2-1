import { useState } from "react";
import { Product } from "../types";

export const useStock = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: "p1", name: "상품1", price: 10000, quantity: 50, discount: 0.1 },
    { id: "p2", name: "상품2", price: 20000, quantity: 30, discount: 0.15 },
    { id: "p3", name: "상품3", price: 30000, quantity: 20, discount: 0.2 },
    { id: "p4", name: "상품4", price: 15000, quantity: 0, discount: 0.05 },
    { id: "p5", name: "상품5", price: 25000, quantity: 10, discount: 0.25 },
  ]);

  const isLowStock = (product: Product) => product.quantity < 5;

  const makeLowStockMessage = (product: Product) => {
    return `${product.name}: ${product.quantity > 0 ? "재고 부족 (" + product.quantity + "개 남음)" : "품절"}\n`;
  };

  const getLowStockMessage = () => {
    return products.filter(isLowStock).map(makeLowStockMessage).join("");
  };

  const getStockProductById = (id: string) => {
    return products.find((prod) => prod.id === id);
  };

  const increaseStock = (id: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          prod.quantity += 1;
        }
        return prod;
      })
    );
  };

  const decreaseStock = (id: string) => {
    setProducts((prev) =>
      prev.map((prod) => {
        if (prod.id === id) {
          prod.quantity -= 1;
        }
        return prod;
      })
    );
  };

  return { products, getLowStockMessage, getStockProductById, increaseStock, decreaseStock };
};
