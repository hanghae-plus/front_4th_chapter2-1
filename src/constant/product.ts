import { Product } from '../interface/cart';

export const TUESDAY = 2;

export const POINT_RATE = 1000;
export const BULK_DISCOUNT_RATE = 0.25;

export const SALE_PROBABILITY = 0.3;

export const productList: Array<Product> = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

export const discountRates: Record<string, number> = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};
