import { useState } from 'react';
import Product from '../types/product.ts';

const useProductList = () => {
  const [productList, setProductList] = useState<Product[]>([
    { id: 'p1', name: '상품1', price: 10_000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20_000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30_000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15_000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25_000, quantity: 10 },
  ]);

  const handleClickDecreaseProductQuantity = (selectedProductId: string) => {
    setProductList((prev) =>
      prev.map((product) => {
        if (product.id === selectedProductId) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      }),
    );
  };

  const handleClickIncreaseProductQuantity = (selectedProductId: string, count: number = 1) => {
    setProductList((prev) =>
      prev.map((product) => {
        if (product.id === selectedProductId) {
          return { ...product, quantity: product.quantity + count };
        }
        return product;
      }),
    );
  };

  const handleRandomPromotion = (productId: string, discountRate: number) => {
    setProductList((prev) => prev.map((product) => {
      if (product.id === productId) {
        return { ...product, price: product.price * (1 - discountRate) };
      }
      return product;
    }));
  };


  return {
    productList,
    handleClickDecreaseProductQuantity,
    handleClickIncreaseProductQuantity,
    handleRandomPromotion,
  };

};

export default useProductList;
