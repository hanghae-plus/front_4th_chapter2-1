import { useCallback, useState, createContext, useContext, useMemo } from 'react';

import type { Product } from '../../types/product';
import type { PropsWithChildren } from 'react';

interface CartContextType {
  cartList: Product[];
  addCartItem: (item: Product) => void;
  clearCartItem: (id: string) => void;
}

export const cartContext = createContext<CartContextType | undefined>(undefined);

export const useGetCartList = () => {
  const context = useContext(cartContext);
  if (context === undefined) {
    throw new Error('useGetCartList must be used within an CartProvider');
  }
  return context.cartList;
};

export const useAddCartItem = () => {
  const context = useContext(cartContext);
  if (context === undefined) {
    throw new Error('useAddCartItem must be used within an CartProvider');
  }
  return context.addCartItem;
};

export const useClearCartItem = () => {
  const context = useContext(cartContext);
  if (context === undefined) {
    throw new Error('useClearCartItem must be used within an CartProvider');
  }
  return context.clearCartItem;
};

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [cartList, setCartList] = useState<Product[]>([]);

  const clearCartItem = useCallback(
    (id: string) => {
      const filterdCartList = cartList.filter((cartItem) => cartItem.id !== id);

      setCartList(filterdCartList);
    },
    [cartList],
  );

  const addCartItem = useCallback(
    (item: Product) => {
      const matchedCartItem = cartList.find((cartItem) => cartItem.id === item.id);

      if (matchedCartItem) {
        const newCartList = cartList.map((cartItem) =>
          cartItem.id === matchedCartItem.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        );

        setCartList(newCartList);
        return;
      }

      setCartList((cartList) => [...cartList, { ...item, quantity: 1 }]);
    },
    [cartList],
  );

  const contextValue = useMemo(() => {
    return {
      addCartItem,
      clearCartItem,
      cartList,
    };
  }, [addCartItem, clearCartItem, cartList]);

  return <cartContext.Provider value={contextValue}>{children}</cartContext.Provider>;
};
