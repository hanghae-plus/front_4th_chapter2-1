import { createContext, useState } from 'react';

import { Cart, Product } from '@/advanced/types/types';

import { INITIAL_CART } from '../types/constant';

interface CartStoreContextProps extends Cart {
  addToCart: (productId: string) => void;
}
export const CartStoreContext = createContext<CartStoreContextProps | null>(null);

export const CartStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastSaleItem, setLastSaleItem] = useState<string | null>(null);
  const [totalAmount] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [discountRate] = useState(0);
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
        setItemCount((prev) => prev + 1);
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
      setItemCount((prev) => prev + 1);
    }
  };

  return (
    <CartStoreContext.Provider
      value={{ lastSaleItem, totalAmount, itemCount, discountRate, productList, addToCart }}
    >
      {children}
    </CartStoreContext.Provider>
  );
};
