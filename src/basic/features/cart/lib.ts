import {
  DISCOUNT,
  BULK_DISCOUNT_RATE,
  TOTAL_DISCOUNT_THRESHOLD,
  INDIVIDUAL_DISCOUNT_THRESHOLD,
  SPECIAL_DISCOUNT_DAY,
  SPECIAL_DISCOUNT_RATE
} from "./config";
import { Cart } from "./model";

export const calcCartItemTotalQuantities = (cart: Cart) => {
  const totalQuantities = cart.reduce((acc, item) => acc + item.quantity, 0);
  return totalQuantities;
};

export const calcTotalCost = (cart: Cart) => {
  const totalCost = cart.reduce((acc, item) => {
    return acc + item.quantity * item.cost;
  }, 0);
  return totalCost;
};

export const calcDiscountedCost = (cart: Cart) => {
  const discountedCost = cart.reduce((acc, item) => {
    if (item.quantity >= INDIVIDUAL_DISCOUNT_THRESHOLD) {
      return acc + item.quantity * item.cost * (1 - DISCOUNT[item.id]);
    }
    return acc + item.quantity * item.cost;
  }, 0);

  // 특별할인 날에 추가 할인
  if (new Date().getDay() === SPECIAL_DISCOUNT_DAY) {
    return discountedCost * (1 - SPECIAL_DISCOUNT_RATE);
  }

  return discountedCost;
};

export const calcDiscountRate = (cart: Cart) => {
  const totalQuantities = calcCartItemTotalQuantities(cart);
  const totalCost = calcTotalCost(cart);
  const discountedCost = calcDiscountedCost(cart);

  const discountRate = (totalCost - discountedCost) / totalCost;

  // 카트품목 수량이 할인 임계 수량을 넘기는 경우
  if (totalQuantities >= TOTAL_DISCOUNT_THRESHOLD) {
    const bulkDiscountCost = totalCost * BULK_DISCOUNT_RATE;
    const individualDiscountCost = totalCost - discountedCost;

    // 총액에서 25% 할인 금액이 개별 할인 금액보다 큰 경우
    if (bulkDiscountCost > individualDiscountCost) {
      return BULK_DISCOUNT_RATE;
    }
  }

  // 특별할인 날에 추가 할인
  if (new Date().getDay() === SPECIAL_DISCOUNT_DAY) {
    return SPECIAL_DISCOUNT_RATE;
  }

  return discountRate;
};

export const calcTotalPoint = (cart: Cart) => {
  const discountedCost = calcDiscountedCost(cart);
  return Math.floor(discountedCost / 1000);
};
