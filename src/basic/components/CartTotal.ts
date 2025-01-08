type CartTotalProps = {
  totalAmount: number;
  discountRate: number;
};

export const CartTotal = ({ totalAmount, discountRate }: CartTotalProps) => {
  const cartTotal = document.getElementById('cart-total');

  if (!cartTotal) return;

  cartTotal.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discountRate > 0) {
    const span = document.createElement('span');

    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotal.appendChild(span);
  }
};
export default CartTotal;
