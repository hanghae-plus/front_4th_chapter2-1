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

  const updateCartList = (cartList: Product[]) => {
    setCartList(cartList);

    const { finalAmount, finalDiscountRate, point } = calculateCartPrice(cartList);

    setTotalAmount(finalAmount);
    setTotalDiscountRate(finalDiscountRate);
    setPoint(point);
  };

  const clearCartItem = useCallback(
    (id: string) => {
      const filterdCartList = cartList.filter((cartItem) => cartItem.id !== id);

      updateCartList(filterdCartList);
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
      const matchedCartItem = getMatchedCartItemById(item.id);

      if (matchedCartItem) {
        const updatedCartList = cartList.map((cartItem) =>
          cartItem.id === matchedCartItem.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        );

        updateCartList(updatedCartList);
        return;
      }

      const updatedCartList = [...cartList, { ...item, quantity: 1 }];

      updateCartList(updatedCartList);
    },
    [addLastSaleItem, cartList, getMatchedCartItemById],
  );

  const removeCartItem = useCallback(
    (id: string) => {
      const matchedCartItem = getMatchedCartItemById(id);

      if (!matchedCartItem) return;

      if (matchedCartItem.quantity === 1) {
        clearCartItem(id);
        return;
      }

      const updatedCartList = cartList.map((cartItem) =>
        cartItem.id === matchedCartItem.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
      );

      updateCartList(updatedCartList);
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
