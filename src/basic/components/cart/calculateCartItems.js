import { CONSTANTS } from '../../constants';
import { helper } from '../../utils/helper';

/**
 * 장바구니 제품 총액 계산
 * @param {*} items
 * @description 장바구니에 담긴 제품 목록을 받고, 'cart-items' DOM 요소를 순회하며 총액을 계산
 * @returns {Object} - 총액, 제품 수량, 할인 적용 전 총액
 * @property {number} totalAmount - 할인 적용 후 총액
 * @property {number} itemCount - 제품 수량
 * @property {number} preDiscountTotal - 할인 적용 전 총액
 */
export function calculateCartItems(items) {
  let totalAmount = 0;
  let itemCount = 0;
  let preDiscountTotal = 0; // 할인 적용 전 총액

  const cartDisplay = document.getElementById('cart-items');
  Array.from(cartDisplay.children).forEach(item => {
    const currentItem = items.find(p => p.id === item.id);
    const quantity = parseInt(
      item.querySelector('span').textContent.split('x ')[1],
    );
    const currentItemAmount = currentItem.price * quantity;

    itemCount += quantity;
    preDiscountTotal += currentItemAmount;

    const discountCondition = quantity >= CONSTANTS.QUANTITY_THRESHOLD;
    const discountRate = discountCondition
      ? helper.getDiscountRate(currentItem.id)
      : 0;

    totalAmount += currentItemAmount * (1 - discountRate);
  });

  return { totalAmount, itemCount, preDiscountTotal };
}
