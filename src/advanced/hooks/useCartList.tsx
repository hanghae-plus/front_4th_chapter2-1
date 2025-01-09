import { useState } from 'react';
import Product from '../types/product.ts';

const useCartList = () => {
  const [cartList, setCartList] = useState<Product[]>([]);

  const handleClickAddProductToCart = (product: Product) => {
    setCartList((prev) => {
      const existingProduct = prev.find((p) => p.id === product.id);
      if (existingProduct) {
        return prev.map((p) => {
          if (p.id === product.id) {
            return { ...p, quantity: p.quantity + 1 };
          }
          return p;
        });
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleClickRemoveProductFromCart = (selectedProductId: string) => {
    setCartList((prev) => prev.filter((product) => product.id !== selectedProductId));
  };

  const handleClickIncreaseQuantityFromCart = (selectedProductId: string) => {
    setCartList((prev) =>
      prev.map((product) => {
        if (product.id === selectedProductId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      }),
    );
  };

  const handleClickDecreaseQuantityFromCart = (selectedProductId: string) => {
    setCartList((prev) =>
      prev.map((product) => {
        if (product.id === selectedProductId) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      }),
    );
  };

  const handleRandomPromotionFromCart = (productId: string, discountRate: number) => {
    setCartList((prev) => prev.map((product) => {
      if (product.id === productId) {
        return { ...product, price: product.price * (1 - discountRate) };
      }
      return product;
    }));
  };


  return {
    cartList,
    handleRandomPromotionFromCart,
    handleClickAddProductToCart,
    handleClickRemoveProductFromCart,
    handleClickIncreaseQuantityFromCart,
    handleClickDecreaseQuantityFromCart,
  };
};

export default useCartList;
