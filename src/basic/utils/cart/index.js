import { QUANTITY_DISCOUNT_RATES, SPECIAL_DISCOUNT_DAY } from "../../constants";
import { cartStore, productStore } from "../../store";

// 1단계: 더티코드의 상품별 할인율 if-else 체인
/*
if (q >= 10) {
  if (curItem.id === "p1") disc = 0.1;
  else if (curItem.id === "p2") disc = 0.15;
  ...
}
*/
const getQuantityDiscountRate = (productId, quantity) => {
  if (!productId || quantity < 0) return 0;

  return quantity >= 10 ? QUANTITY_DISCOUNT_RATES[productId] || 0 : 0;
};

// 2단계: 더티코드의 대량 구매 할인 로직
/*
if (newItemCnt >= 30) {
  const bulkDisc = newTotalAmt * 0.25;
  const itemDisc = subTot - newTotalAmt;
  if (bulkDisc > itemDisc) {
    newTotalAmt = subTot * (1 - 0.25);
    discRate = 0.25;
  }
}
*/
const calculateVolumePurchaseDiscount = (totalAmount, subtotal, itemCount) => {
  if (itemCount < 30) return { amount: totalAmount, rate: 0 };

  const volumePurchaseDiscount = totalAmount * 0.25;
  const itemDiscountAmount = subtotal - totalAmount;

  if (volumePurchaseDiscount <= itemDiscountAmount) {
    return { amount: totalAmount, rate: itemDiscountAmount / subtotal };
  }

  return {
    amount: subtotal * 0.75,
    rate: 0.25,
  };
};

// 3단계: 더티코드의 화요일 할인 로직
/*
if (new Date().getDay() === 2) {
  newTotalAmt *= 0.9;
  discRate = Math.max(discRate, 0.1);
}
*/
const applySpecialDayDiscount = (amount, currentRate) => {
  const isSpecialDiscountDay = new Date().getDay() === SPECIAL_DISCOUNT_DAY;
  if (!isSpecialDiscountDay) return { amount, rate: currentRate };

  return {
    amount: amount * 0.9,
    rate: Math.max(currentRate, 0.1),
  };
};

// 4단계: 메인 계산 함수 (더티코드의 calcCart)
export const calculateCart = ($cartItems) => {
  const calculation = {
    totalAmount: 0,
    itemCount: 0,
    subtotal: 0,
    discountRate: 0,
  };

  // 각 아이템 계산
  Array.from($cartItems.children).forEach((item) => {
    const productId = item.id;
    const quantity = parseInt(
      item.querySelector("span").textContent.split("x ")[1],
    );
    const product = productStore
      .get("products")
      .find((product) => product.id === productId);

    const productTotalPrice = product.price * quantity;
    const quantityDiscountRate = getQuantityDiscountRate(productId, quantity);

    calculation.itemCount += quantity;
    calculation.subtotal += productTotalPrice;
    calculation.totalAmount += productTotalPrice * (1 - quantityDiscountRate);
    calculation.discountRate = Math.max(
      calculation.discountRate,
      quantityDiscountRate,
    );
  });

  // 대량 구매 할인 적용
  const volumeDiscount = calculateVolumePurchaseDiscount(
    calculation.totalAmount,
    calculation.subtotal,
    calculation.itemCount,
  );
  calculation.totalAmount = volumeDiscount.amount;
  calculation.discountRate = Math.max(
    calculation.discountRate,
    volumeDiscount.rate,
  );

  // 특별 할인일 할인 적용
  const specialDayDiscount = applySpecialDayDiscount(
    calculation.totalAmount,
    calculation.discountRate,
  );
  calculation.totalAmount = specialDayDiscount.amount;
  calculation.discountRate = Math.max(
    calculation.discountRate,
    specialDayDiscount.rate,
  );

  const result = {
    totalAmount: Math.round(calculation.totalAmount),
    itemCount: calculation.itemCount,
    discountRate: calculation.discountRate,
    points: Math.floor(calculation.totalAmount / 1000),
    lastSelected: cartStore.get("cartState")?.lastSelected,
  };

  // 이전 상태와 비교 후 업데이트
  const prevState = cartStore.get("cartState");
  if (!prevState || JSON.stringify(prevState) !== JSON.stringify(result)) {
    cartStore.set("cartState", result);
  }

  return result;
};
