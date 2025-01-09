import { useCallback, useState, useMemo } from 'react';

import { cartContext } from './CartContext';
import { calculateCartPrice } from '../../utils/cart/calculateCart';
import { useAddLastSaleItem, useResetQuantity } from '../product-context/ProductContext';

import type { Product } from '../../types/product';
import type { PropsWithChildren } from 'react';

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [cartList, setCartList] = useState<Product[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [point, setPoint] = useState(0);
  const [totalDiscountRate, setTotalDiscountRate] = useState(0);

  const resetQuantity = useResetQuantity();

  const addLastSaleItem = useAddLastSaleItem();

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
      resetQuantity(id);
    },
    [cartList, resetQuantity],
  );

  const getMatchedCartItemById = useCallback(
    (id: string) => {
      return cartList.find((cartItem) => cartItem.id === id);
    },
    [cartList],
  );

  const addCartItem = useCallback(
    (item: Product) => {
      addLastSaleItem(item);
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
    [addLastSaleItem, cartList],
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
