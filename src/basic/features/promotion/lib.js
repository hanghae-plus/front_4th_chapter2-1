import { isOutOfStock } from '../../entities/stock/lib.js';

export const createPeriodicEvent = ({ callback, initialDelay, intervalDelay }) => {
  const timeout = setTimeout(() => {
    const interval = setInterval(callback, intervalDelay);
    return () => clearInterval(interval);
  }, initialDelay);
  return () => clearTimeout(timeout);
};


export const calculateDiscountedPrice = (price, discountRate) => Math.round(price * (1-discountRate));
export const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)];
export const findSuggestItem = (items, selectedItemId) => {
  return items.find((product) => product.id !== selectedItemId && isOutOfStock(product));
};