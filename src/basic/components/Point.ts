import { cartStore } from '@/stores/cartStore';
import { createElement } from '@/utils/createElement';

const Point = () => {
  let point = document.getElementById('loyalty-points');
  const cartTotal = document.getElementById('cart-total');

  if (!cartTotal) return;

  const updateBonusPoint = () => {
    const totalPoint = Math.floor(cartStore.get('totalAmount') / 1000);

    if (!point) {
      point = createElement('span');
      point.id = 'loyalty-points';
      point.className = 'text-blue-500 ml-2';
      cartTotal.appendChild(point);
    }

    point.textContent = `(포인트: ${totalPoint})`;
    cartStore.set('point', totalPoint);
  };

  updateBonusPoint();
  cartStore.subscribe('totalAmount', updateBonusPoint);
};

export default Point;
