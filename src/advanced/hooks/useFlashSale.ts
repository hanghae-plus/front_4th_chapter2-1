import { useEffect } from 'react';

import { useProducts } from '../stores/ProductContext';

import type { Product } from '../types/product.type';

const FLASH_SALE = {
  INTERVAL: 30000,
  INITIAL_DELAY: 10000,
  DISCOUNT_RATE: 0.8,
  TRIGGER_PROBABILITY: 0.3,
} as const;

const getRandomItemWithStock = (items: Product[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

const shouldTriggerFlashSale = () => {
  return Math.random() < FLASH_SALE.TRIGGER_PROBABILITY;
};

// 원본 데이터를 직접 수정하고 있어서 좋지 않음
const applyDiscount = (item: Product) => {
  item.originalPrice = Math.round(item.originalPrice * FLASH_SALE.DISCOUNT_RATE);
};

export const useFlashSale = () => {
  const {
    state: { items },
  } = useProducts();
  const applyFlashSaleDiscount = () => {
    const luckyItem = getRandomItemWithStock(items);

    if (shouldTriggerFlashSale() && luckyItem) {
      applyDiscount(luckyItem);
      alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    }
  };

  useEffect(() => {
    let flashSaleInterval;
    const initialTimeout = setTimeout(() => {
      flashSaleInterval = setInterval(applyFlashSaleDiscount, FLASH_SALE.INTERVAL);
    }, Math.random() * FLASH_SALE.INITIAL_DELAY);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(flashSaleInterval);
    };
  }, [items]);
};
