import { useCart } from '../hooks/useCart.js';

export function CartSummary() {
  const element = document.createElement('div');
  element.className = 'text-xl font-bold my-4';

  const { getCart } = useCart();

  const calSummary = () => {
    const cart = getCart();
    let total = 0;

    cart.forEach(({ product, quantity }) => {
      const itemTotal = product.price * quantity;
      const discount = 0;
      total += itemTotal * (1 - discount);
    });

    const points = Math.floor(total / 1000);

    return { total, points };
  };

  const render = () => {
    const { total, points } = calSummary();
    element.innerHTML = `
      총액 : ${total}원
      <span class="text-blue-500 ml-2">(포인트: ${points})</span>
    `;
  };

  return {
    getElement: () => element,
    render,
  };
}
