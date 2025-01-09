import { renderCartTotal } from './CartTotal';
import { renderStockStatus } from './StockStatus';

export const updateCartUI = (totals) => {
  renderCartTotal({
    amount: totals.finalAmount,
    discountRate: totals.discountRate,
    point: totals.point,
  });
  renderStockStatus();
};
