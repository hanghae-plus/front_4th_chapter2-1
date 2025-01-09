import { Product } from "../types/cart";

export const PRODUCTS: Product[] = [
  { id: "p1", name: "상품1", val: 10000, q: 50 },
  { id: "p2", name: "상품2", val: 20000, q: 30 },
  { id: "p3", name: "상품3", val: 30000, q: 20 },
  { id: "p4", name: "상품4", val: 15000, q: 0 },
  { id: "p5", name: "상품5", val: 25000, q: 10 },
];

export const INDIVIDUAL_DISCOUNTS: Record<string, number> = {
  p1: 0.1, // 10% 할인
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};
