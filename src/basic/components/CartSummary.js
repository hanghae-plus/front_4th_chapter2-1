import { useCart } from '../hooks/useCart.js';

export function CartSummary() {
  const element = document.createElement('div');
  element.id = 'cart-total';
  element.className = 'text-xl font-bold my-4';

  const { getCart } = useCart();

  const calSummary = () => {
    const cart = getCart();
    let subtotal = 0;
    let totalWithQuantityDiscount = 0;
    let totalQuantity = 0;

    // 각 상품의 수량별 할인 계산
    cart.forEach(({ product, quantity }) => {
      const itemTotal = product.price * quantity;
      subtotal += itemTotal;
      totalQuantity += quantity;

      if (quantity >= 10) {
        totalWithQuantityDiscount += itemTotal * (1 - product.discountRate);
      } else {
        totalWithQuantityDiscount += itemTotal;
      }
    });

    // 최종 금액 계산 (수량 할인 vs 대량 구매 할인)
    let finalTotal = totalWithQuantityDiscount;
    let discountRate = (subtotal - totalWithQuantityDiscount) / subtotal || 0;

    // 30개 이상 구매시 25% 할인과 비교
    if (totalQuantity >= 30) {
      const bulkDiscountTotal = subtotal * 0.75; // 25% 할인
      if (bulkDiscountTotal < finalTotal) {
        finalTotal = bulkDiscountTotal;
        discountRate = 0.25;
      }
    }

    // 화요일 추가 할인
    if (new Date().getDay() === 2) {
      const tuesdayDiscount = 0.1;
      discountRate = Math.max(discountRate, tuesdayDiscount);
      finalTotal = subtotal * (1 - discountRate);
    }

    const points = Math.floor(finalTotal / 1000);

    return {
      total: Math.round(finalTotal),
      points,
      discountRate,
    };
  };

  const render = () => {
    const { total, points, discountRate } = calSummary();

    let html = `총액: ${total}원`;
    if (discountRate > 0) {
      html += `<span class="text-green-500 ml-2">(${(discountRate * 100).toFixed(1)}% 할인 적용)</span>`;
    }
    html += `<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${points})</span>`;

    element.innerHTML = html;
  };

  return {
    getElement: () => element,
    render,
  };
}
