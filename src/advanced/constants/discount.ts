export const DISCOUNT_RATE: { [key: string]: number } = {
  BULK_DISCOUNT: 0.25,
  WEEK_DISCOUNT_2: 0.1,
  WOW_DISCOUNT: 0.8,
  RECOMMEND_DISCOUNT: 0.95,
};

export type ProductId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';

export const PRODUCT_DISCOUNT: Record<ProductId, { minQuantity: number; rate: number }> = {
  p1: { minQuantity: 10, rate: 0.1 },
  p2: { minQuantity: 15, rate: 0.15 },
  p3: { minQuantity: 20, rate: 0.2 },
  p4: { minQuantity: 5, rate: 0.05 },
  p5: { minQuantity: 25, rate: 0.25 },
};

export const BULK_ORDER_QUANTITY = 30;
