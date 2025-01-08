import { Product } from '../../../shared/entity/model/Product';

const renderBonusPoints = (
  totalAmount: Product['quantity'],
  TotalCostView: HTMLDivElement,
) => {
  const bonusPoints = Math.floor(totalAmount / 1000);
  let PointsTag = document.getElementById('loyalty-points');
  if (!PointsTag) {
    PointsTag = document.createElement('span');
    PointsTag.id = 'loyalty-points';
    PointsTag.className = 'text-blue-500 ml-2';
    TotalCostView.appendChild(PointsTag);
  }
  PointsTag.textContent = '(포인트: ' + bonusPoints + ')';
};

export { renderBonusPoints };
