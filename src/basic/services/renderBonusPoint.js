// 포인트 계산
export const renderBonusPoint = (totalAmount) => {
  bonusPoints = Math.floor(totalAmount / 1000);

  let pointsTag = document.getElementById("loyalty-points");
  if (!pointsTag) {
    pointsTag = document.createElement("span");
    pointsTag.id = "loyalty-points";
    pointsTag.className = "text-blue-500 ml-2";
    sum.appendChild(pointsTag);
  }
  pointsTag.textContent = "(포인트: " + bonusPoints + ")";
};
