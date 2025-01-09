import { renderSelectOptions } from '../components/renderer/renderer';

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

function shouldTriggerFlashSale() {
  return Math.random() < FLASH_SALE.TRIGGER_PROBABILITY;
}

function applyDiscount(item: Product) {
  item.originalPrice = Math.round(item.originalPrice * FLASH_SALE.DISCOUNT_RATE);
}

export const startFlashSale = (products: Product[]) => {
  const applyFlashSaleDiscount = () => {
    const luckyItem = getRandomItemWithStock(products);

    if (shouldTriggerFlashSale() && luckyItem) {
      applyDiscount(luckyItem);
      alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
      renderSelectOptions(products);
    }
  };

  setTimeout(() => {
    setInterval(applyFlashSaleDiscount, FLASH_SALE.INTERVAL);
  }, Math.random() * FLASH_SALE.INITIAL_DELAY);
};
