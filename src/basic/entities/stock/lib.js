import { STOCK } from '../../shared/lib/stock/config.js';

export const isLowStock = (item) => item.quantity < STOCK.LOW;
export const isOutOfStock = (item) => item.quantity <= STOCK.EMPTY;
export const isOutOfStockRange = (newQty, qty) =>
  newQty <= STOCK.EMPTY || newQty > qty;
