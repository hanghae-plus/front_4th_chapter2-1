// CartContext.tsx
import React, { createContext, useContext, useReducer } from 'react';

import { cartReducer } from '../services/cartService';

import type { CartState, CartAction } from '../services/cartService';
import type { Product } from '../types/product.type';

interface CartProviderProps {
  children: React.ReactNode;
}

// CartContext에서 제공할 값의 형태
interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  getItem: (productId: string) => Product | undefined;
  getTotalQuantity: () => number;
}

// CartContext 초기 상태
const initialState: CartState = {
  items: [],
  lastSelectedId: null,
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: CartProviderProps) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // cartReducer에서 이미 대부분 로직을 처리하지만,
  // 필요한 편의 메서드를 context level에서 추가로 제공해줄 수도 있습니다.
  const getItem = (productId: string) => {
    return state.items.find((item) => item.id === productId);
  };

  const getTotalQuantity = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ state, dispatch, getItem, getTotalQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

// 훅으로 만들어서 사용자가 더 편하게 사용할 수 있도록 함
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
