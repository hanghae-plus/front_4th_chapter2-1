import { helper } from '../../utils/helper';
import Points from './Points';

/**
 * 보너스 포인트를 렌더링하는 함수
 * @description 장바구니 총액 하단에 보너스 포인트를 렌더링합니다.
 * @param {*} bonusPoints - 보너스 포인트
 * @returns {void}
 */
export function renderBonusPoints(bonusPoints) {
  let points = document.getElementById('loyalty-points');
  if (!points) {
    points = Points();

    const cartTotal = document.getElementById('cart-total');
    cartTotal.appendChild(points);
  }

  points.textContent = helper.getBonusPointsMessage(bonusPoints);
}
