import { productStore } from '../../stores/productStore.js';

export const TotalInfo = () => {
  const { totalPrice, discountRate } = calculateCart();

  const bonusPoints = totalPrice / 1000;

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
    if (currentItemCount >= 10) {
      if (product.id === 'p1') discount = 0.1;
      else if (product.id === 'p2') discount = 0.15;
      else if (product.id === 'p3') discount = 0.2;
      else if (product.id === 'p4') discount = 0.05;
      else if (product.id === 'p5') discount = 0.25;
    }

    totalPrice += itemTotalPrice * (1 - discount);
    discountDetails.push({ productId: product.id, discount });
  });

  let discountRate;
  if (itemCount >= 30) {
    const bulkDisc = totalPrice * 0.25;
    const itemDisc = totalTemp - totalPrice;

    if (bulkDisc > itemDisc) {
      totalPrice = totalTemp * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (totalTemp - totalPrice) / totalTemp;
    }
  } else {
    discountRate = (totalTemp - totalPrice) / totalTemp;
  }

  if (new Date().getDay() === 2) {
    totalPrice *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }

  return {
    totalPrice: Math.round(totalPrice),
    discountRate: discountRate * 100,
    itemCount,
    discountDetails,
  };
}
