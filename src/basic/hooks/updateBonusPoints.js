import {
  cartTotal,
  getBonusPoints,
  getTotalAmount,
  setBonusPoints,
} from '../main.basic.js';

export const updateBonusPoints = () => {
  const s = Math.floor(getTotalAmount() / 1000);
  setBonusPoints(s);
  let bonusPointsElement = document.getElementById('loyalty-points');
  if (!bonusPointsElement) {
    bonusPointsElement = document.createElement('span');
    bonusPointsElement.id = 'loyalty-points';
    bonusPointsElement.className = 'text-blue-500 ml-2';
    cartTotal.appendChild(bonusPointsElement);
  }
  bonusPointsElement.textContent = '(포인트: ' + getBonusPoints() + ')';
};
