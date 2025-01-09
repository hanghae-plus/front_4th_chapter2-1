const renderBonusPoints = (
  finalPrice: number,
  callback: (parentElement: HTMLElement) => void,
) => {
  const bonusPoints = Math.floor(finalPrice / 1000);
  const PointsTag = document.createElement('span');
  PointsTag.id = 'loyalty-points';
  PointsTag.className = 'text-blue-500 ml-2';
  PointsTag.textContent = '(포인트: ' + bonusPoints + ')';

  callback(PointsTag);
};

export { renderBonusPoints };
