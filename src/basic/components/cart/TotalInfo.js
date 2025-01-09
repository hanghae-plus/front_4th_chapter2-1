import { productStore } from '../../stores/productStore.js';
import {
  BONUS_POINT_DIVISOR,
  DISCOUNT_RATES,
  LOYALTY_DAY,
  MIN_BULK_COUNT,
  MIN_ITEM_COUNT_FOR_DISCOUNT,
} from '../../constants/discount.js';

export const TotalInfo = () => {
  const { totalPrice, discountRate } = calculateCart();

  const bonusPoints = totalPrice / BONUS_POINT_DIVISOR;

  return `<div id="cart-total" class="text-xl font-bold my-4">총액: ${totalPrice}원<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${bonusPoints})</span><span class="text-green-500 ml-2">
${
  discountRate > 0
    ? `<span class="text-green-500 ml-2">(${discountRate.toFixed(1)}% 할인 적용)</span>`
    : ''
}
</span>
</div>`;
};

function calculateCart() {
  const { productList } = productStore.getState();

  let totalPrice = 0;
  let totalTemp = 0;
  let itemCount = 0;
  const discountDetails = [];

  productStore.getState().cartList.forEach((cartItem) => {
    const product = productList.find((p) => p.id === cartItem.id);
    if (!product) return;

    const currentItemCount = cartItem.quantity;
    const itemTotalPrice = product.price * currentItemCount;
    totalTemp += itemTotalPrice;
    itemCount += currentItemCount;

    let discount = 0;
    if (currentItemCount >= MIN_ITEM_COUNT_FOR_DISCOUNT) {
      discount = DISCOUNT_RATES.PRODUCT[product.id] || 0;
    }

    totalPrice += itemTotalPrice * (1 - discount);
    discountDetails.push({ productId: product.id, discount });
  });

  let discountRate;
  if (itemCount >= MIN_BULK_COUNT) {
    const bulkDisc = totalPrice * DISCOUNT_RATES.BULK_PURCHASE;
    const itemDisc = totalTemp - totalPrice;

    if (bulkDisc > itemDisc) {
      totalPrice = totalTemp * (1 - DISCOUNT_RATES.BULK_PURCHASE);
      discountRate = DISCOUNT_RATES.BULK_PURCHASE;
    } else {
      discountRate = (totalTemp - totalPrice) / totalTemp;
    }
  } else {
    discountRate = (totalTemp - totalPrice) / totalTemp;
  }

  if (new Date().getDay() === LOYALTY_DAY) {
    totalPrice *= 1 - DISCOUNT_RATES.LOYALTY_DAY;
    discountRate = Math.max(discountRate, DISCOUNT_RATES.LOYALTY_DAY);
  }

  return {
    totalPrice: Math.round(totalPrice),
    discountRate: discountRate * 100,
    itemCount,
    discountDetails,
  };
}
