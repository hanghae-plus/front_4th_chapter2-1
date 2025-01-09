import { ELEMENT_IDS } from '../constants/element-id';
import { getCartTotalElement } from '../utils/dom';

const CartTotal = ({ amount, discountRate, point }) => {
  return /* html */ `<div class="text-xl font-bold my-4">총액: ${Math.round(amount)}원${
    discountRate > 0 ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>` : ''
  }<span id="${ELEMENT_IDS.POINT}">(포인트: ${point})</span></div>`;
};

export default CartTotal;

export const renderCartTotal = ({ amount, discountRate, point }) => {
  const cartTotal = getCartTotalElement();
  cartTotal.innerHTML = CartTotal({ amount, discountRate, point });
};
