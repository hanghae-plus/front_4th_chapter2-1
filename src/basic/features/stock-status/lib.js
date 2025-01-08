import { isOutOfStock } from '../../entities/stock/model.js';

export const getStockStatusMessage = (item) =>
  isOutOfStock(item) ? '품절' : `재고 부족 (${item.quantity}개 남음)`;
