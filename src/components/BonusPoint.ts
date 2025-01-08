import { cartStore } from '@/stores/cartStore';

import { createElement } from '@utils/createElement';

const BonusPoint = () => {
  let bonusPoint = document.getElementById('bonus-point');
  const cartTotal = document.getElementById('cart-total');

  if (!cartTotal) return;

  const updateBonusPoint = () => {
    const points = Math.floor(cartStore.get('totalAmount') / 1000);

    if (!bonusPoint) {
      bonusPoint = createElement('span');
      bonusPoint.id = 'bonus-points';
      bonusPoint.className = 'text-blue-500 ml-2';
      cartTotal.appendChild(bonusPoint);
    }

    bonusPoint.textContent = `(포인트: ${points})`;
    cartStore.set('bonusPoint', points);
  };

  updateBonusPoint();
  cartStore.subscribe('bonusPoint', updateBonusPoint);
};

export default BonusPoint;
