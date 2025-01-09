import { useCallback, useState, createContext, useContext, useMemo } from 'react';

import { calculateCartPrice } from '../../utils/cart/calculateCart';

import type { Product } from '../../types/product';
import type { PropsWithChildren } from 'react';

interface CartContextType {
  cartList: Product[];
  totalAmount: number;
  totalDiscountRate: number;
  point: number;
  addCartItem: (item: Product) => void;
  clearCartItem: (id: string) => void;
  removeCartItem: (id: string) => void;
}

export const cartContext = createContext<CartContextType | undefined>(undefined);

export const useGetCartList = () => {
  const context = useContext(cartContext);
  if (context === undefined) {
    throw new Error('useGetCartList must be used within an CartProvider');
  }
  return context.cartList;
};

export const useGetTotalAmount = () => {
  const context = useContext(cartContext);
  if (context === undefined) {
    throw new Error('useGetCartTotalAmount must be used within an CartProvider');
  }
  return context.totalAmount;
};

export const useGetPoint = () => {
  const context = useContext(cartContext);
  if (context === undefined) {
    throw new Error('useGetPoint must be used within an CartProvider');
  }
  return context.point;
};

export const useGetTotalDiscountRate = () => {
  const context = useContext(cartContext);
  if (context === undefined) {
    throw new Error('useGetTotalDiscountRate must be used within an CartProvider');
  }
  return context.totalDiscountRate;
};

export const useAddCartItem = () => {
  const context = useContext(cartContext);
  if (context === undefined) {
    throw new Error('useAddCartItem must be used within an CartProvider');
  }
  return context.addCartItem;
};

export const useRemoveCartItem = () => {
  const context = useContext(cartContext);
  if (context === undefined) {
    throw new Error('useRemoveCartItem must be used within an CartProvider');
  }
  return context.removeCartItem;
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
  const [totalAmount, setTotalAmount] = useState(0);
  const [point, setPoint] = useState(0);
  const [totalDiscountRate, setTotalDiscountRate] = useState(0);

  const calculateCart = (cartList: Product[]) => {
    const { finalAmount, finalDiscountRate, point } = calculateCartPrice(cartList);
    setTotalAmount(finalAmount);
    setTotalDiscountRate(finalDiscountRate);
    setPoint(point);
  };

  const clearCartItem = useCallback(
    (id: string) => {
      const filterdCartList = cartList.filter((cartItem) => cartItem.id !== id);

      setCartList(filterdCartList);
      calculateCart(filterdCartList);
    },
    [cartList],
  );

  const getMatchedCartItemById = useCallback(
    (id: string) => {
      return cartList.find((cartItem) => cartItem.id === id);
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
        calculateCart(newCartList);
        return;
      }

      const newCartList = [...cartList, { ...item, quantity: 1 }];
      setCartList(newCartList);

      calculateCart(newCartList);
    },
    [cartList],
  );

  const removeCartItem = useCallback(
    (id: string) => {
      const matchedCartItem = getMatchedCartItemById(id);

      if (!matchedCartItem) return;

      if (matchedCartItem.quantity === 1) {
        clearCartItem(id);
        return;
      }

      const newCartList = cartList.map((cartItem) =>
        cartItem.id === matchedCartItem.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
      );

      setCartList(newCartList);
      calculateCart(newCartList);
    },
    [cartList, clearCartItem, getMatchedCartItemById],
  );

  const contextValue = useMemo(() => {
    return {
      addCartItem,
      clearCartItem,
      removeCartItem,
      totalAmount,
      totalDiscountRate,
      cartList,
      point,
    };
  }, [addCartItem, clearCartItem, removeCartItem, totalAmount, totalDiscountRate, cartList, point]);

  return <cartContext.Provider value={contextValue}>{children}</cartContext.Provider>;
};
