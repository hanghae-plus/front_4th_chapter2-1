import { cartStore } from "../../../../store";
import { combineStyles } from "../../../../utils";

export const CartSummary = () => {
  // Cart Summary Element
  const $cartSummary = document.createElement("div");
  const cartSummaryId = "cart-total";
  const cartSummaryStyles = combineStyles("text-xl", "font-bold", "my-4");
  $cartSummary.id = cartSummaryId;
  $cartSummary.className = cartSummaryStyles;

  // Points Element
  const $points = document.createElement("span");
  const pointsId = "loyalty-points";
  const pointsStyles = combineStyles("text-blue-500", "ml-2");
  $points.id = pointsId;
  $points.className = pointsStyles;

  // Discount Element
  const $discount = document.createElement("span");
  const discountStyles = combineStyles("text-green-500", "ml-2");
  $discount.className = discountStyles;

  // Total Text Node
  const $total = document.createTextNode("");

  // Construct DOM Structure
  $cartSummary.appendChild($total);
  $cartSummary.appendChild($discount);
  $cartSummary.appendChild($points);

  const updateCartSummaryDisplay = ({ totalAmount, discountRate, points }) => {
    const hasDiscount = discountRate > 0;

    $total.textContent = `총액: ${totalAmount}원`;

    $discount.textContent = hasDiscount
      ? `(${(discountRate * 100).toFixed(1)}% 할인 적용)`
      : "";
    $discount.style.display = hasDiscount ? "inline" : "none";

    $points.textContent = `(포인트: ${points})`;
  };

  // 초기 렌더링
  const initialState = cartStore.get("cartState");
  if (initialState) {
    updateCartSummaryDisplay(initialState);
  }

  // 장바구니 상태 변경 구독
  cartStore.subscribe("cartState", () => {
    const state = cartStore.get("cartState");
    if (state) {
      updateCartSummaryDisplay(state);
    }
  });

  return $cartSummary;
};
