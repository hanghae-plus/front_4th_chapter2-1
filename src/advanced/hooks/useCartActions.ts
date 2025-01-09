import { useState } from "react";
import { Product } from "../config/constans";

interface CartItem {
  [key: string]: {
    id: string;
    price: number;
    quantity: number;
  };
}

const useCartActions = (
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
) => {
  const [cartItems, setCartItems] = useState<CartItem>({});
  const [lastPickProduct, setLastPickProduct] = useState<string | null>(null);

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.quantity <= 0) return;

    setCartItems((prev) => {
      const currentQuantity = prev[productId]?.quantity || 0;
      return {
        ...prev,
        [productId]: {
          ...product,
          quantity: currentQuantity + 1
        }
      };
    });

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
        ? { ...p, quantity: p.quantity - 1}
        : p
      )
    );

    setLastPickProduct(productId);
  };

  const updateCartQuantity = (productId: string, change: number) => {
    const product = products.find((p) => p.id === productId);
    const currentQuantity = cartItems[productId]?.quantity || 0;
    const newQuantity = currentQuantity + change;

    if (newQuantity <= 0) {
      const { [productId]: removed, ...rest } = cartItems;
      setCartItems(rest);

      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
          ? { ...p, quantity: p.quantity + currentQuantity }
          : p
        )
      );
    } else if (change > 0 && product?.quantity <= 0) {
      alert("재고가 부족합니다");
    } else {
      setCartItems((prev) => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: newQuantity,
        }
      }));
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
          ? { ...p, quantity: p.quantity - change }
          : p
        )
      );
    }
  };

  return { cartItems, lastPickProduct, addToCart, updateCartQuantity };
};

export default useCartActions;