import React, { createContext, useContext, useState } from "react";

interface CartItem {
  id: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
  lastSelected: string | null;
  bonusPoints: number;
  discountRate: number;
  subtotal: number;
}

interface CartContextType {
  cartState: CartState;
  setCartState: React.Dispatch<React.SetStateAction<CartState>>;
}

const initialCartState: CartState = {
  items: [],
  totalAmount: 0,
  itemCount: 0,
  lastSelected: null,
  bonusPoints: 0,
  discountRate: 0,
  subtotal: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartState, setCartState] = useState<CartState>(initialCartState);

  return (
    <CartContext.Provider value={{ cartState, setCartState }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
