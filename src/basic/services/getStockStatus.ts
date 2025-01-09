import type { Product } from '../types/product.type';

export interface StockStatus {
  name: string;
  status: string;
}

export const getStockStatus = (products: Product[]): StockStatus[] => {
  return products
    .filter((item) => item.quantity < 5)
    .map((item) => ({
      name: item.name,
      status: item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절',
    }));
};
