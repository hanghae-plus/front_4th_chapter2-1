import { calculateOverallDiscount } from '../../utils/calculateOverallDiscount';
import { helper } from '../../utils/helper';
import { calculateCartItems } from '../cart/calculateCartItems';
import { getTotalBonusPoints } from '../points/getTotalBonusPoints';
import { renderBonusPoints } from '../points/renderBonusPoints';
import { updateStockInfoMessage } from '../stockStatus/updateStockInfoMessage';
import { renderDiscountedAmount } from './renderDiscountedAmount';

/**
 * 장바구니 상품 목록을 받아 총 금액을 계산하고 화면에 표시
 * @param {*} products 장바구니 상품 목록
 * @returns {void}
 */
export const renderCalculateCart = products => {
  const { totalAmount, itemCount, preDiscountTotal } =
    calculateCartItems(products);

  const { overallDiscountRate, discountedTotalAmount } =
    calculateOverallDiscount(totalAmount, preDiscountTotal, itemCount);

  const roundedAmount = Math.round(discountedTotalAmount);
  const totalDisplay = document.getElementById('cart-total');
  totalDisplay.textContent = helper.getTotalAmountMessage(roundedAmount);

  if (overallDiscountRate > 0) {
    const discountedAmount = renderDiscountedAmount(overallDiscountRate);
    totalDisplay.appendChild(discountedAmount);
  }

  const updatedMessage = updateStockInfoMessage(products);
  const stockInfo = document.getElementById('stock-status');
  stockInfo.textContent = updatedMessage;

  const bonusPoints = getTotalBonusPoints(discountedTotalAmount);
  renderBonusPoints(bonusPoints);
};
