import { renderCartTotalText } from './renderCartTotalText';
import { renderDiscount } from './renderDiscount';
import { renderBonusPoint } from './renderPoint';
import { renderProductStock } from './renderProductStock';
import { calculateFinalAmount } from '../../services/calcProductDiscount';
import { Cart } from '../../stores/cart.store';
import { Products } from '../../stores/product.store';
import { $ } from '../../utils/dom.utils';

export const renderCartSummary = () => {
  const { amount, discountRate } = calculateFinalAmount(Cart.items);
  const $cartTotal = $('#cart-total');

  renderCartTotalText($cartTotal, amount);
  renderDiscount($cartTotal, discountRate);
  renderProductStock(Products.items);
  renderBonusPoint(amount);
};
