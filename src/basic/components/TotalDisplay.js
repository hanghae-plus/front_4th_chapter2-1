import { createUIElement } from "../utils/createUIElement.js";

export function renderTotal(total, totalEl, discountRate = 0) {
  totalEl.innerHTML = `총액: ${Math.round(total)}원`;

  if (discountRate > 0) {
    const discountEl = createUIElement("span", {
      className: "text-green-500 ml-2",
      textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
    });
    totalEl.appendChild(discountEl);
  }

  let pointsEl = document.getElementById("loyalty-points");
  if (!pointsEl) {
    pointsEl = createUIElement("span", {
      id: "loyalty-points",
      className: "text-blue-500 ml-2",
    });
    totalEl.appendChild(pointsEl);
  }
  pointsEl.textContent = `(포인트: ${Math.floor(total / 1000)})`;
}
