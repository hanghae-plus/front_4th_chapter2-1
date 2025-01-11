import { createContext, useEffect, useState } from 'react';

import { Cart, Product } from '@/advanced/types/types';

import { INITIAL_CART } from '../types/constant';

interface CartStoreContextProps extends Cart {
  changeProductListPrice: (productId: string) => void;
  addToCart: (productId: string) => void;
  changeToCart: (productId: string, quantity: number) => void;
  removeToCart: (productId: string) => void;
}
export const CartStoreContext = createContext<CartStoreContextProps | null>(null);

export const CartStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastSaleItem, setLastSaleItem] = useState<string | null>(null);
  const [productList, setProductList] = useState<Product[]>(INITIAL_CART);

  useEffect(() => {
    const randomSaleTimer = setTimeout(() => {
      const randomSaleInterval = setInterval(() => {
        const randomProduct = productList[Math.floor(Math.random() * productList.length)];

        if (Math.random() < 0.3 && randomProduct.stock > 0) {
          setProductList((prevList) =>
            prevList.map((p) =>
              p.id === randomProduct.id ? { ...p, price: Math.round(p.price * 0.8) } : p
            )
          );
          alert(`번개세일! ${randomProduct.name}이(가) 20% 할인 중입니다!`);
        }
      }, 30000);

      return () => clearInterval(randomSaleInterval);
    }, Math.random() * 10000);

    // 추가 세일 이벤트
    const additionalSaleTimer = setTimeout(() => {
      const additionalSaleInterval = setInterval(() => {
        if (lastSaleItem) {
          const suggestedProduct = productList.find(
            (item) => item.id !== lastSaleItem && item.stock > 0
          );

          if (suggestedProduct) {
            setProductList((prevList) =>
              prevList.map((p) =>
                p.id === suggestedProduct.id ? { ...p, price: Math.round(p.price * 0.95) } : p
              )
            );
            alert(`${suggestedProduct.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          }
        }
      }, 60000);

      return () => clearInterval(additionalSaleInterval);
    }, Math.random() * 10000);

    return () => {
      clearTimeout(randomSaleTimer);
      clearTimeout(additionalSaleTimer);
    };
  }, [lastSaleItem, productList]);

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

  const changeProductListPrice = (productId: string) => {
    setProductList(
      productList.map((p) => (p.id === productId ? { ...p, price: Math.round(p.price * 0.8) } : p))
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
        changeProductListPrice,
      }}
    >
      {children}
    </CartStoreContext.Provider>
  );
};
