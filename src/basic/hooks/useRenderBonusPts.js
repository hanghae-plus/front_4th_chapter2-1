import { totalAmt } from "../common/state";

export const useRenderBonusPts = () => {
  const cartTotal = document.getElementById("cart-total");
  if (!cartTotal) {
    console.error("cart-total 요소를 찾을 수 없습니다.");
    return;
  }
  let bonusPts = Math.floor(totalAmt / 1000);
  let ptsTag = document.getElementById("loyalty-points");
  if (!ptsTag) {
    const ptsTagComponent = document.getElementById("loyalty-points");
    cartTotal.appendChild(ptsTagComponent);
  }
  ptsTag.textContent = "(포인트: " + bonusPts + ")";
};
