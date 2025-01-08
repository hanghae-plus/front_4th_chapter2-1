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
  const { salePrice, discountRate } = calculateCartSummary({
    cartItems,
  });

  const $cartTotal = document.getElementById('cart-total');
  $cartTotal.textContent = '총액: ' + Math.round(salePrice) + '원';

  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    $cartTotal.appendChild(span);
  }

  const loyaltyPoint = salePrice > 0 ? Math.floor(salePrice / 1000) : 0;
  let $loyaltyPoints = document.getElementById('loyalty-points');
  if (!$loyaltyPoints) {
    $loyaltyPoints = document.createElement('span');
    $loyaltyPoints.id = 'loyalty-points';
    $loyaltyPoints.className = 'text-blue-500 ml-2';
    $cartTotal.appendChild($loyaltyPoints);
  }
  $loyaltyPoints.textContent = '(포인트: ' + loyaltyPoint + ')';
};
