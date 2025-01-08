import { calculateCartSummary } from '../utils/calculateCartSummary';

export const CartTotal = ({ cartItems }) => {
  const { salePrice, discountRate } = calculateCartSummary({
    cartItems,
  });
  const loyaltyPoint = salePrice > 0 ? Math.floor(salePrice / 1000) : 0;

  return `
    <div id="cart-total" class="text-xl font-bold my-4">
      <span>총액: ${Math.round(salePrice)}원<span>${discountRate > 0 ? `(${(discountRate * 100).toFixed(1)}% 할인 적용)` : ''}<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${loyaltyPoint})</span>
    </div>
  `;
};

export const renderCartTotal = ({ cartItems }) => {
  const $cartTotal = document.getElementById('cart-total');
  $cartTotal.innerHTML = CartTotal({ cartItems });
};
