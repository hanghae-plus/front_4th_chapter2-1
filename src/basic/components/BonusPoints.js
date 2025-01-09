export const BonusPoints = (bonusPoints) => {
  let element = document.getElementById("loyalty-points");

  if (!element) {
    element = document.createElement("span");
    element.id = "loyalty-points";
    element.className = "text-blue-500 ml-2";
  }

  element.textContent = "(포인트: " + bonusPoints + ")";

  return element;
};
