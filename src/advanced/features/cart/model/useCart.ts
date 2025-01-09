import { useState } from "react";
import { useStock } from "@advanced/features/stock";
import { Product } from "@advanced/entities/product";
import { Cart } from "./types";

export const useCart = () => {
  const [cart, setCart] = useState<Cart>([]);
  const { stock, onUpdateQuantity } = useStock();

  const handleAddItem = (product: Product) => {
    const hasProduct = cart.some((item) => item.id === product.id);

    onUpdateQuantity(product.id, -1);

    if (hasProduct) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (productId: string) => {
    const foundedItem = cart.find((item) => item.id === productId);

    if (!foundedItem) {
      throw Error();
    }

    onUpdateQuantity(productId, 1);

    if (foundedItem.quantity > 1) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      setCart((prev) => prev.filter((item) => item.id !== productId));
    }
  };

  const handleDeleteItem = (productId: string) => {
    const foundedItem = cart.find((item) => item.id === productId);

    if (!foundedItem) {
      throw Error();
    }
    onUpdateQuantity(productId, foundedItem.quantity);
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  return {
    cart,
    stock,
    onAdd: handleAddItem,
    onRemove: handleRemoveItem,
    onDelete: handleDeleteItem
  };
};
