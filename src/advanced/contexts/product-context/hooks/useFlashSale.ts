import { useEffect } from 'react';

import type { Product } from '../../../types/product';

const FLASH_SALE_DISCOUNT_RATE = 0.8; // 20% 할인
const FLASH_SALE_PROBABILITY = 0.3; // 30% 확률
const INITIAL_FLASH_SALE_DELAY = 10000; // 초기 딜레이 (10초)
const FLASH_SALE_INTERVAL = 30000; // 번개세일 간격 (30초)

export const useFlashSale = (
  productList: Product[],
  setProductList: React.Dispatch<React.SetStateAction<Product[]>>,
) => {
  const notifyFlashSale = (product: Product) => {
    alert(`번개세일! ${product.name}이(가) 20% 할인 중입니다!`);
  };

  const applyFlashSale = (product: Product) => {
    const discountedAmout = Math.round(product.amount * FLASH_SALE_DISCOUNT_RATE);
    const updatedProductList = productList.map((product) =>
      product.id === product.id ? { ...product, amount: discountedAmout } : product,
    );

    setProductList(updatedProductList);
  };

  const getRandomProduct = () => {
    return productList[Math.floor(Math.random() * productList.length)];
  };

  const triggerFlashSale = () => {
    const randomProduct = getRandomProduct();

    const shouldApplyFlashSale = Math.random() < FLASH_SALE_PROBABILITY && randomProduct.quantity > 0;

    if (shouldApplyFlashSale) {
      applyFlashSale(randomProduct);
      notifyFlashSale(randomProduct);
    }
  };

  useEffect(() => {
    const initialDelay = Math.random() * INITIAL_FLASH_SALE_DELAY;

    const flashSaleInterval = FLASH_SALE_INTERVAL;

    const saleTimeout = setTimeout(() => {
      const saleInterval = setInterval(triggerFlashSale, flashSaleInterval);
      return () => clearInterval(saleInterval);
    }, initialDelay);

    return () => clearTimeout(saleTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
