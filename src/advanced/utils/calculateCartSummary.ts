import type { CartItemType } from '../store/useCartStore';

const VOLUME_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;

export const calculateCartSummary = (cartItems: CartItemType[]) => {
  let retailPrice = 0;
  let salePrice = 0;
  let totalQuantity = 0;

  cartItems.forEach((item) => {
    const { quantity, id, price } = item;

    let discountRate = 0;
    if (quantity >= 10) {
      if (id === 'p1') discountRate = 0.1;
      else if (id === 'p2') discountRate = 0.15;
      else if (id === 'p3') discountRate = 0.2;
      else if (id === 'p4') discountRate = 0.05;
      else if (id === 'p5') discountRate = 0.25;
    }

    const subtotal = price * quantity;
    retailPrice += subtotal;
    salePrice += subtotal * (1 - discountRate);
    totalQuantity += quantity;
  });

  const discountAmount = retailPrice - salePrice;
  let discountRate = 0;
  if (totalQuantity >= 30) {
    const volumeDiscountAmount = retailPrice * VOLUME_DISCOUNT_RATE;
    if (volumeDiscountAmount > discountAmount) {
      discountRate = VOLUME_DISCOUNT_RATE;
      salePrice = retailPrice * (1 - VOLUME_DISCOUNT_RATE);
    } else {
      discountRate = discountAmount / retailPrice;
    }
  } else {
    discountRate = discountAmount / retailPrice;
  }

  if (new Date().getDay() === 2) {
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
    salePrice *= 1 - discountRate;
  }

  return { retailPrice, salePrice, totalQuantity, discountRate };
};
