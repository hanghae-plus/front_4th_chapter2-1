import { createContext, useState } from 'react';

import { Cart, Product } from '@/advanced/types/types';

import { INITIAL_CART } from '../types/constant';

interface CartStoreContextProps extends Cart {
  addToCart: (productId: string) => void;
  changeToCart: (productId: string, quantity: number) => void;
  removeToCart: (productId: string) => void;
}
export const CartStoreContext = createContext<CartStoreContextProps | null>(null);

export const CartStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastSaleItem, setLastSaleItem] = useState<string | null>(null);
  const [productList, setProductList] = useState<Product[]>(INITIAL_CART);

  const addToCart = (productId: string) => {
    const itemToAdd = productList.find((p) => p.id === productId);

    if (!itemToAdd || itemToAdd.stock <= 0) {
      alert('재고가 부족합니다.');

      return;
    }

    const existingItem = productList.find((p) => p.id === productId);

    if (existingItem) {
      const newQuantity = (existingItem.quantity || 0) + 1;

      if (newQuantity <= itemToAdd.stock) {
        setProductList(
          productList.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  quantity: newQuantity,
                  stock: p.stock - 1,
                }
              : p
          )
        );
        setLastSaleItem(productId);
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      setProductList([
        ...productList,
        {
          ...itemToAdd,
          quantity: 1,
          stock: itemToAdd.stock - 1,
        },
      ]);
      setLastSaleItem(productId);
    }
  };

  const changeToCart = (productId: string, quantity: number) => {
    const item = productList.find((p) => p.id === productId);

    if (!item) return;

    const newQuantity = item.quantity + quantity;

    if (newQuantity <= 0) {
      removeToCart(productId);

      return;
    }

    if (quantity > 0 && item.stock < quantity) {
      alert('재고가 부족합니다.');

      return;
    }

    setProductList(
      productList.map((p) =>
        p.id === productId
          ? {
              ...p,
              quantity: newQuantity,
              stock: p.stock - quantity,
            }
          : p
      )
    );
  };

  const removeToCart = (productId: string) => {
    const item = productList.find((p) => p.id === productId);

    if (!item) return;

    setProductList(
      productList.map((p) =>
        p.id === productId
          ? {
              ...p,
              quantity: 0,
              stock: p.stock + item.quantity,
            }
          : p
      )
    );
  };

  return (
    <CartStoreContext.Provider
      value={{
        lastSaleItem,
        productList,
        addToCart,
        changeToCart,
        removeToCart,
      }}
    >
      {children}
    </CartStoreContext.Provider>
  );
};
