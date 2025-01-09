import React, { ReactNode, useMemo, useReducer, useRef, useState } from 'react';
import { CartItem, Product } from '../type';
import { GlobalContext, GlobalContextType } from './useGlobalContext';

type CartAction =
  | { type: 'ADD'; id: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'CHANGE_QTY'; id: string; newQty: number };

export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const productList: Product[] = [
    { id: 'p1', name: '상품1', val: 10000, qty: 50 },
    { id: 'p2', name: '상품2', val: 20000, qty: 30 },
    { id: 'p3', name: '상품3', val: 30000, qty: 20 },
    { id: 'p4', name: '상품4', val: 15000, qty: 0 },
    { id: 'p5', name: '상품5', val: 25000, qty: 10 },
  ];

  const [randomDiscRateByProduct, setRandomDiscRateByProduct] = useState<
    Record<string, number>
  >({
    p1: 0,
    p2: 0,
    p3: 0,
    p4: 0,
    p5: 0,
  });

  const cartReducer = (state: CartItem[], action: CartAction): CartItem[] => {
    const { id } = action;

    switch (action.type) {
      case 'ADD': {
        const product = productList.find((product) => product.id === id);

        if (!product) {
          throw Error(`${id} is not a valid product.`);
        }

        if (product.qty < 1) {
          alert('재고가 부족합니다.');
          return state;
        }

        return [...state, { id, qty: 1 }];
      }

      case 'REMOVE': {
        const isInCart = state.some((item) => item.id === id);

        if (!isInCart) {
          throw Error(`${id} does not exist in the cart item list.`);
        }

        return state.filter((item) => item.id !== id);
      }

      case 'CHANGE_QTY': {
        const { newQty } = action;
        const product = productList.find((product) => product.id === id);

        if (!product) {
          throw Error(`${id} is not a valid product.`);
        }

        if (product.qty < newQty) {
          alert('재고가 부족합니다.');
          return state;
        }

        return state.map((item) =>
          item.id === id ? { id, qty: newQty } : item,
        );
      }
    }
  };

  const [cartList, dispatchCartList] = useReducer(cartReducer, []);

  const lastSelectedId = useRef<string | null>(null);

  const value = useMemo<GlobalContextType>(
    () => ({
      values: {
        productList,
        cartItemList: cartList,
        randomDiscRateByProduct,
        lastSelectedId: lastSelectedId.current,
      },
      actions: {
        addCartItem: (id: string) => dispatchCartList({ type: 'ADD', id }),
        removeCartItem: (id: string) =>
          dispatchCartList({ type: 'REMOVE', id }),
        editCartItem: (id: string, newQty: number) =>
          dispatchCartList({ type: 'CHANGE_QTY', id, newQty }),
        setRandomDiscRate: (productId: string, rate: number) => {
          setRandomDiscRateByProduct((prev) => {
            const newRandomDiscRateByProduct = { ...prev, [productId]: rate };
            // newRandomDiscRateByProduct[productId] = rate;
            return newRandomDiscRateByProduct;
          });
        },
        setLastSelectedId: (id: string) => {},
      },
    }),
    [productList, cartList, randomDiscRateByProduct, lastSelectedId],
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
