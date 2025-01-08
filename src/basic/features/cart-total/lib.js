import { calculateCartItemValues } from '../cart-calculation/ui.js';
import {
  calculateFinalAmount,
  calculateFinalDiscount,
} from '../cart-calculation/lib.js';

export const calculateCartTotals = (cartItems, products) => {
  let totalAmount = 0;
  let itemCount = 0;
  let subTotal = 0;

  cartItems.forEach((cartItem) => {
    const product = products.find((p) => p.id === cartItem.id);
    const { quantity, productAmount, discount } = calculateCartItemValues(
      product,
      cartItem
    );

    itemCount += quantity;
    subTotal += productAmount;
    totalAmount += productAmount * (1 - discount);
  });
  const discountRate = calculateFinalDiscount(itemCount, totalAmount, subTotal);
  const finalAmount = calculateFinalAmount(itemCount, totalAmount, subTotal);

  return {
    discountRate,
    finalAmount,
  };
};
