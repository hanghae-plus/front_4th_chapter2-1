import { useCallback, useState, createContext, useMemo } from 'react';

import { calculateCartPrice } from '../../utils/cart/calculateCart';
import { useCreateCartContext } from '../utils/createContext';

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

export const useGetCartList = () => useCreateCartContext(cartContext, 'useGetCartList', 'cartProvider').cartList;
export const useGetTotalAmount = () =>
  useCreateCartContext(cartContext, 'useGetTotalAmount', 'cartProvider').totalAmount;
export const useGetPoint = () => useCreateCartContext(cartContext, 'useGetPoint', 'cartProvider').point;
export const useGetTotalDiscountRate = () =>
  useCreateCartContext(cartContext, 'useGetTotalDiscountRate', 'cartProvider').totalDiscountRate;
export const useAddCartItem = () => useCreateCartContext(cartContext, 'useAddCartItem', 'cartProvider').addCartItem;
export const useRemoveCartItem = () =>
  useCreateCartContext(cartContext, 'useRemoveCartItem', 'cartProvider').removeCartItem;
export const useClearCartItem = () =>
  useCreateCartContext(cartContext, 'useClearCartItem', 'cartProvider').clearCartItem;

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
