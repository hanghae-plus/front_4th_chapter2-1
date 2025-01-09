import { useEffect, useRef } from 'react';

import { CartItems } from '../components/CartItems';
import { CartTotal } from '../components/CartTotal';
import { ProductSelect } from '../components/ProductSelect';
import { Layout } from '../layout/Layout';
import { useProductsStore } from '../store/useProductsStore';

export const CartPage = () => {
  const { products, luckySale } = useProductsStore();

  const latestProducts = useRef([...products]);
  useEffect(() => {
    latestProducts.current = [...products];
  }, [products]);

  const isTimeoutRegistered = useRef(false);
  useEffect(() => {
    if (!isTimeoutRegistered.current) {
      isTimeoutRegistered.current = true;

      setTimeout(() => {
        setInterval(() => {
          const products = latestProducts.current;
          const luckyItem =
            products[Math.floor(Math.random() * products.length)];
          if (Math.random() < 0.3 && luckyItem.stock > 0) {
            luckySale(luckyItem.id);
            alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
          }
        }, 30000);
      }, Math.random() * 10000);
    }
  }, [luckySale]);

  return (
    <Layout title='장바구니'>
      <CartItems />
      <CartTotal />
      <ProductSelect />
    </Layout>
  );
};
