import { Product } from "@advanced/entities/product";

export const DISCOUNT: Record<Product["id"], number> = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25
} as const;

export const TOTAL_DISCOUNT_THRESHOLD = 30;
export const INDIVIDUAL_DISCOUNT_THRESHOLD = 10;
export const BULK_DISCOUNT_RATE = 0.25;

export const SPECIAL_DISCOUNT_DAY = 2;
export const SPECIAL_DISCOUNT_RATE = 0.1;
