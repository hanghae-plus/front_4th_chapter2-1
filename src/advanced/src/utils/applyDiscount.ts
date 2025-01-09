import { Item } from '../types';

export const applyDiscount = (item: Item, discountRate: number) => ({
  ...item,
  price: Math.round(item.price * (1 - discountRate))
});
