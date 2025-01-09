import { CartStore } from '../../store/cartStore';

export const TotalPrice = () => {
  const { actions } = CartStore;

  const totalPrice = actions.getTotalPrice();
  const totalDiscountRate = actions.getTotalDiscountRate();
  const point = actions.getPoint();

  const isShowDiscount = totalDiscountRate > 0;

  const render = `
  <div id="cart-total" class="text-xl font-bold my-4">
  총액: ${Math.round(totalPrice)}원<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${point})</span>
  ${
    isShowDiscount
      ? `<span class="text-green-500 ml-2">
  (${(totalDiscountRate * 100).toFixed(1)}% 할인 적용)
    </span>`
      : ``
  }
  </div>
  `;

  return { render };
};
