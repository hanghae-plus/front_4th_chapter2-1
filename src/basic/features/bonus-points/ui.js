import { calculatePoints, formatPointsMessage } from './model.js';

const renderBonusPoints = (totalAmount, parentElement) => {
  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    parentElement.appendChild(pointsTag);
  }
  pointsTag.textContent = formatPointsMessage(calculatePoints(totalAmount));
};

export default renderBonusPoints;
