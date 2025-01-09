import { cartStore } from '@/stores/cartStore';
import { createElement } from '@/utils/createElement';

export const CartTotal = (): HTMLDivElement => {
  const container = createElement('div', {
    id: 'cart-total',
    class: 'text-xl font-bold my-4',
  });

  const render = () => {
    const totalAmount = cartStore.get('totalAmount');
    const discountRate = cartStore.get('discountRate') || 0;
    const totalPoint = Math.floor(totalAmount / 1000);

    container.innerHTML = `
    <div id="cart-total" class="text-xl font-bold my-4">총액: ${Math.round(totalAmount)}원${
      discountRate > 0
        ? `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>`
        : ''
    }<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${totalPoint})</span></div>`.trim();
  };

  render();
  cartStore.subscribe('totalAmount', render);
  cartStore.subscribe('discountRate', render);

  return container;
};

export default CartTotal;
