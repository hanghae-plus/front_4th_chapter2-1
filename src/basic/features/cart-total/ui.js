import { DISCOUNT } from '../../entities/discount/config.js';
import { updateStockInformation } from '../stock-status/ui.js';
import renderBonusPoints from '../bonus-points/ui.js';
import {
  calculateFinalAmount,
  calculateFinalDiscount,
} from '../cart-calculation/lib.js';
import {
  formatDiscountRate,
  formatTotalPrice,
} from '../cart-calculation/model.js';
import { calculateCartItemValues } from '../cart-calculation/ui.js';
import { calculateCartTotals } from './lib.js';

const renderDiscountTag = (discountRate) => {
  const span = document.createElement('span');
  span.className = 'text-green-500 ml-2';
  span.textContent = formatDiscountRate(discountRate);
  return span;
};

const renderCartTotal = ({
  finalAmount,
  discountRate,
  totalCartAmountElement,
}) => {
  totalCartAmountElement.textContent = formatTotalPrice(finalAmount);

  if (discountRate > DISCOUNT.NONE) {
    totalCartAmountElement.appendChild(renderDiscountTag(discountRate));
  }
};

export const renderCart = ({
  cartItems,
  products,
  totalCartAmountElement,
  stockStatusElement,
}) => {
  const { finalAmount, discountRate } = calculateCartTotals(
    Array.from(cartItems),
    products
  );

  renderCartTotal({
    finalAmount,
    discountRate,
    totalCartAmountElement,
  });

  stockStatusElement.textContent = updateStockInformation(products);
  renderBonusPoints(finalAmount, totalCartAmountElement);
};
