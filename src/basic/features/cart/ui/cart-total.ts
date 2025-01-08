import { html } from "@basic/shared/lib/render";
import { calcDiscountedCost, calcDiscountRate, calcTotalPoint } from "../lib";
import { cartStore } from "../model";

export function CartTotal() {
  const { cart } = cartStore.getState();

  const discountedCost = calcDiscountedCost(cart);
  const discountRate = calcDiscountRate(cart);
  const point = calcTotalPoint(cart);

  return html`
    <div id="cart-total" class="text-xl font-bold my-4">
      <span>총액: ${discountedCost}원</span>
      ${discountRate > 0
        ? html`<span class="text-green-500 ml-2"
            >(${(discountRate * 100).toFixed(1)}% 할인 적용)</span
          >`
        : ""}
      <span id="loyalty-points" class="text-blue-500 ml-2"
        >(포인트: ${point})</span
      >
    </div>
  `;
}
