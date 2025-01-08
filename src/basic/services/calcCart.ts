import { productStore } from '../stores/productStore.ts';
import { cloneDeep } from '../utils/object.ts';
import { getAllItemAmount } from './getAllItemAmount.ts';
import { getTotalAmount } from './getTotalAmount.ts';
import { getProductDiscountedTotalAmount } from './getProductDiscountedTotalAmount.ts';
import { Discount, MIN_QUANTITY_FOR_BULK_DISCOUNT } from '../constants/discount-contants.ts';
import { DayOfWeek } from '../constants/date-contants.ts';
import { appendDiscountedRateTag } from './appendDiscountedRateTag.ts';
import { updateStockInfo } from './updateStockInfo.ts';
import { renderBonusPoints } from './renderBonusPoints.ts';
import { $cartDisplay } from '../elements/cartDisplay.ts';
import { $cartTotalAmount } from '../elements/cartTotalAmount.ts';
import { $stockInfo } from '../elements/stockInfo.ts';

export const calcCart = () => {
  const { getState } = productStore;
  const productList = cloneDeep(getState());

  const $cartItems = Array.from($cartDisplay.children) as HTMLOptionElement[];

  let totalAmount;
  let itemCnt = getAllItemAmount($cartItems);

  let originTotal = getTotalAmount(productList, $cartItems);
  totalAmount = getProductDiscountedTotalAmount($cartItems, productList);

  let discRate = (originTotal - totalAmount) / originTotal;

  if (itemCnt >= MIN_QUANTITY_FOR_BULK_DISCOUNT) {
    const bulkDiscountedTotal = originTotal * (1 - Discount.BulkDiscount);

    totalAmount = Math.min(bulkDiscountedTotal, totalAmount);
    discRate = Math.max(discRate, Discount.BulkDiscount);
  }

  if (new Date().getDay() === DayOfWeek.Tuesday) {
    totalAmount *= 1 - Discount.TuesdayDiscount;
    discRate = Math.max(discRate, Discount.TuesdayDiscount);
  }

  $cartTotalAmount.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (discRate > 0) {
    appendDiscountedRateTag($cartTotalAmount, discRate);
  }

  updateStockInfo($stockInfo, productList);
  renderBonusPoints($cartTotalAmount, totalAmount);
};
