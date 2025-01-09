// ProductsContext.tsx
import React, { createContext, useContext, useReducer } from 'react';

import { productsReducer } from '../services/productService';

import type { ProductsState, ProductsAction } from '../services/productService';
import type { Product } from '../types/product.type';

interface ProductsProviderProps {
  children: React.ReactNode;
}

/** 처음에 보여줄 상품 목록(예시) */
const initialProducts: Product[] = [
  { id: 'p1', name: '상품1', originalPrice: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', originalPrice: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', originalPrice: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', originalPrice: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', originalPrice: 25000, quantity: 10 },
];

/** ProductsState의 초기 상태 */
const initialState: ProductsState = {
  items: initialProducts,
};

/** Context에서 제공할 값의 형태 */
interface ProductsContextValue {
  state: ProductsState;
  dispatch: React.Dispatch<ProductsAction>;
  getItem: (productId: string) => Product | undefined;
  increaseQuantity: (productId: string, quantity: number) => void;
  decreaseQuantity: (productId: string, quantity: number) => void;
}

/** ProductsContext 생성 */
const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

export const ProductsProvider = ({ children }: ProductsProviderProps) => {
  const [state, dispatch] = useReducer(productsReducer, initialState);

  /** 편의 메서드: ID로 특정 Product 찾기 */
  const getItem = (productId: string) => {
    return state.items.find((item) => item.id === productId);
  };

  /** 편의 메서드: 수량 증가 */
  const increaseQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: { productId, quantity } });
  };

  /** 편의 메서드: 수량 감소 */
  const decreaseQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: { productId, quantity } });
  };

  return (
    <ProductsContext.Provider
      value={{
        state,
        dispatch,
        getItem,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

/** ProductsContext를 편하게 사용하기 위한 커스텀 훅 */
export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }

  return context;
}
