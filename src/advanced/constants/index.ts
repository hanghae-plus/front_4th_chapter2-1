export const PRODUCT_DISCOUNTS: { [key: string]: number } = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

export const BULK_PURCHASE_THRESHOLD = 30;
export const BULK_PURCHASE_DISCOUNT_RATE = 0.25;

export const PROMOTION_CONFIG = {
  FLASH_SALE: {
    INTERVAL: 30000,
    INITIAL_DELAY: 10000,
    PROBABILITY: 0.3,
    DISCOUNT_RATE: 0.8,
  },
  RECOMMENDATION: {
    INTERVAL: 60000,
    INITIAL_DELAY: 20000,
    DISCOUNT_RATE: 0.95,
  },
};

export const INITIAL_PRODUCTS = [
  { id: "p1", name: "상품1", price: 10000, stock: 50 },
  { id: "p2", name: "상품2", price: 20000, stock: 30 },
  { id: "p3", name: "상품3", price: 30000, stock: 20 },
  { id: "p4", name: "상품4", price: 15000, stock: 0 },
  { id: "p5", name: "상품5", price: 25000, stock: 10 },
];
