import { CartStore } from '../../store/cartStore';

export const TotalPrice = () => {
  const { actions } = CartStore;

  const totalAmount = actions.getTotalAmount();
  const totalDiscountRate = actions.getTotalDiscountRate();

  const isShowDiscount = totalDiscountRate > 0;

  const render = `
  <div id="cart-total" class="text-xl font-bold my-4">
  총액: ${Math.round(totalAmount)} 원
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
