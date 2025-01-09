import { useState, useCallback } from "react";
import { Product, CartItem } from "../types/cart";
import { PRODUCTS } from "../constants/products";
import { calculateCartTotal } from "../utils/calculate";

export function useCart() {
  const [products, setProducts] = useState<Product[]>([...PRODUCTS]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id === productId);
      if (!product || product.q <= 0) {
        alert("재고가 부족합니다.");
        return;
      }

      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.productId === productId);
        if (existingItem) {
          return prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...prev, { productId, quantity: 1 }];
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, q: p.q - 1 } : p)),
      );
    },
    [products],
  );

  const updateQuantity = useCallback(
    (productId: string, change: number) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      if (change > 0 && product.q <= 0) {
        alert("재고가 부족합니다.");
        return;
      }

      setCartItems((prev) => {
        const existingItem = prev.find((item) => item.productId === productId);
        if (!existingItem) return prev;

        const newQuantity = existingItem.quantity + change;
        if (newQuantity <= 0) {
          return prev.filter((item) => item.productId !== productId);
        }

        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item,
        );
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, q: p.q - change } : p)),
      );
    },
    [products],
  );

  const getTotal = useCallback(() => {
    return calculateCartTotal(cartItems, products);
  }, [cartItems, products]);

  return {
    products,
    cartItems,
    addToCart,
    updateQuantity,
    getTotal,
  };
}
