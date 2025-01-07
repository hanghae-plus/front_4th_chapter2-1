import { helper } from '../../utils/helper';

/**
 * 할인율에 따른 할인 금액 렌더링
 * @param {*} overallDiscountRate 전체 할인율
 * @returns {HTMLSpanElement} 할인 금액을 표시하는 span 요소
 */
export function renderDiscountedAmount(overallDiscountRate) {
  const discountSpan = document.createElement('span');
  discountSpan.className = 'text-green-500 ml-2';

  const discountedAmount = (overallDiscountRate * 100).toFixed(1);
  discountSpan.textContent =
    helper.getDiscountedAmountMessage(discountedAmount);

  return discountSpan;
}
