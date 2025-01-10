import { createContext } from "react";
import { useCart } from "advanced/hooks/useCart";

export const CartContext = createContext<ReturnType<typeof useCart> | null>(
  null
);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const cart = useCart();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
};
