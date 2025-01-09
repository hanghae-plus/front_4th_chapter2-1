import { useCallback, useState, useMemo } from 'react';

import { cartContext } from './CartContext';
import { calculateCartPrice } from '../../utils/cart/calculateCart';
import { useAddLastSaleItem, useResetQuantity } from '../product-context/ProductContext';

import type { Product } from '../../types/product';
import type { PropsWithChildren } from 'react';

export const CartProvider = ({ children }: PropsWithChildren) => {
  const [cartList, setCartList] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [point, setPoint] = useState(0);
  const [totalDiscountRate, setTotalDiscountRate] = useState(0);

  const resetQuantity = useResetQuantity();

  const addLastSaleItem = useAddLastSaleItem();

  const updateCartList = (cartList: Product[]) => {
    setCartList(cartList);

    const { finalPrice, finalDiscountRate, point } = calculateCartPrice(cartList);

    setTotalPrice(finalPrice);
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

  const getUpdatedCartListWithQuantity = useCallback(
    (item: Product, delta: number) => {
      return cartList.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + delta } : cartItem,
      );
    },
    [cartList],
  );

  const addCartItem = useCallback(
    (item: Product) => {
      addLastSaleItem(item);
      const matchedCartItem = getMatchedCartItemById(item.id);

      if (matchedCartItem) {
        const updatedCartList = getUpdatedCartListWithQuantity(matchedCartItem, 1);

        updateCartList(updatedCartList);
        return;
      }

      const updatedCartList = [...cartList, { ...item, quantity: 1 }];

      updateCartList(updatedCartList);
    },
    [addLastSaleItem, cartList, getMatchedCartItemById, getUpdatedCartListWithQuantity],
  );

  const removeCartItem = useCallback(
    (id: string) => {
      const matchedCartItem = getMatchedCartItemById(id);

      if (!matchedCartItem) return;

      const isNoMoreCartItem = matchedCartItem.quantity === 1;

      if (isNoMoreCartItem) {
        clearCartItem(id);
        return;
      }

      const updatedCartList = getUpdatedCartListWithQuantity(matchedCartItem, -1);

      updateCartList(updatedCartList);
    },
    [clearCartItem, getMatchedCartItemById, getUpdatedCartListWithQuantity],
  );

  const contextValue = useMemo(() => {
    return {
      addCartItem,
      clearCartItem,
      removeCartItem,
      totalPrice,
      totalDiscountRate,
      cartList,
      point,
    };
  }, [addCartItem, clearCartItem, removeCartItem, totalPrice, totalDiscountRate, cartList, point]);

  return <cartContext.Provider value={contextValue}>{children}</cartContext.Provider>;
};
