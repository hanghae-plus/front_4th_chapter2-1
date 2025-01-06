import { helper } from '../../utils/helper';

/**
 * 보너스 포인트를 렌더링하는 함수
 * @description 장바구니 총액 하단에 보너스 포인트를 렌더링합니다.
 * @param {*} bonusPoints - 보너스 포인트
 * @returns {void}
 */
export function renderBonusPoints(bonusPoints) {
  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';

    const totalDisplay = document.getElementById('cart-total');
    totalDisplay.appendChild(pointsTag);
  }
  pointsTag.textContent = helper.getBonusPointsMessage(bonusPoints);
}
