import { DISCOUNT_RATE } from '../constants/index.js';
import { isTuesday } from './date.js';

export const findSelectedItemInfo = ({ cartItem, prodList }) => {
  return prodList.find(prod => prod.id === cartItem.id);
};

export const getSelectedItemQuantity = ({ cartItem }) => {
  return parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
};

export const evaluateDiscountRate = ({ itemQuantity, itemID }) => {
  let discount = 0;

  if (itemQuantity >= 10) {
    if (itemID === 'p1') discount = DISCOUNT_RATE.ITEM.P1;
    else if (itemID === 'p2') discount = DISCOUNT_RATE.ITEM.P2;
    else if (itemID === 'p3') discount = DISCOUNT_RATE.ITEM.P3;
    else if (itemID === 'p4') discount = DISCOUNT_RATE.ITEM.P4;
    else if (itemID === 'p5') discount = DISCOUNT_RATE.ITEM.P5;
  }

  return discount;
};

export const calculateTotals = ({ cartItemDOMs, prodList }) => {
  return cartItemDOMs.reduce(
    (totals, cartItem) => {
      const selectedItemInfo = findSelectedItemInfo({ cartItem, prodList });
      const selectedQuantity = getSelectedItemQuantity({ cartItem });
      const { val: price, id: itemID } = selectedItemInfo;

      const itemTotal = price * selectedQuantity;
      const discountRate = evaluateDiscountRate({ itemQuantity: selectedQuantity, itemID });
      const discountedTotal = itemTotal * (1 - discountRate);

      return {
        totalAmount: totals.totalAmount + discountedTotal,
        totalItemsCount: totals.totalItemsCount + selectedQuantity,
        subTotalAmount: totals.subTotalAmount + itemTotal,
      };
    },
    { totalAmount: 0, totalItemsCount: 0, subTotalAmount: 0 }
  );
};

// 대량 구매 할인
export const applyBulkDiscount = ({ totalAmount, totalItemsCount, subTotalAmount }) => {
  let discountRate = 0;
  let discountedAmount = totalAmount;

  if (totalItemsCount >= 30) {
    const bulkDiscount = totalAmount * DISCOUNT_RATE.BULK;
    const itemDiscount = subTotalAmount - totalAmount;

    if (bulkDiscount > itemDiscount) {
      discountedAmount = subTotalAmount * (1 - DISCOUNT_RATE.BULK);
      discountRate = DISCOUNT_RATE.BULK;
    } else {
      discountRate = itemDiscount / subTotalAmount;
    }
  } else {
    discountRate = (subTotalAmount - totalAmount) / subTotalAmount;
  }

  return { discountedAmount, discountRate };
};

// 화요일 할인
export const applyTuesdayDiscount = (amount, currentRate) => {
  if (isTuesday()) {
    const tuesdayDiscountedAmount = amount * (1 - DISCOUNT_RATE.TUESDAY);
    const newRate = Math.max(currentRate, DISCOUNT_RATE.TUESDAY);
    return { amount: tuesdayDiscountedAmount, discountRate: newRate };
  }
  return { amount, discountRate: currentRate };
};

// 장바구니에 있는 데이터 기반으로 총액 계산
export const calculateCart = ({ cartDisplayComponent, prodList }) => {
  const cartItemDOMs = cartDisplayComponent.get('children');

  // 총액, 총 아이템 수, 소계 계산
  const { totalAmount, totalItemsCount, subTotalAmount } = calculateTotals({
    cartItemDOMs,
    prodList,
  });

  // 대량 구매 할인 적용
  const { discountedAmount: bulkDiscountedAmount, discountRate: bulkDiscountRate } = applyBulkDiscount({
    totalAmount,
    totalItemsCount,
    subTotalAmount,
  });

  // 화요일 할인 적용
  const { amount, discountRate } = applyTuesdayDiscount(bulkDiscountedAmount, bulkDiscountRate);

  return { amount, discountRate };
};
