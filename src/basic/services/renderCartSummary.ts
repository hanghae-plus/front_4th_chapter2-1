import { calculateFinalAmount } from './calcProductDiscount';
import { renderDiscount } from './renderDiscount';
import { renderBonusPoint } from './renderPoint';
import { renderProductStock } from './renderProductStock';
import { updateCartTotalText } from './setCartTotalText';
import { Cart } from '../stores/cart.store';
import { $ } from '../utils/dom.utils';

export const renderCartSummary = () => {
  const { amount, discountRate } = calculateFinalAmount(Cart.items);
  const $cartTotal = $('#cart-total');

  updateCartTotalText($cartTotal, amount);
  renderDiscount($cartTotal, discountRate);
  renderProductStock();
  renderBonusPoint(amount);
};
