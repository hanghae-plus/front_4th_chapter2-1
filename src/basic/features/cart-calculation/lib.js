import { CRITERIA, DISCOUNT } from '../../entities/discount/config.js';
import { isTuesday } from '../../shared/lib/date/index.js';

export const calculateBulkDiscount = (itemCount, totalAmount, subTotal) => {
  if (itemCount < CRITERIA.BULK) {
    return (subTotal - totalAmount) / subTotal;
  }
  const bulkDiscount = totalAmount * DISCOUNT.QUARTER;
  const productDiscount = subTotal - totalAmount;

  return bulkDiscount > productDiscount
    ? DISCOUNT.QUARTER
    : (subTotal - totalAmount) / subTotal;
};
export const calculateFinalDiscount = (itemCount, totalAmount, subTotal) => {
  const baseDiscount = calculateBulkDiscount(itemCount, totalAmount, subTotal);
  return isTuesday()
    ? Math.max(baseDiscount, DISCOUNT.TEN_PERCENT)
    : baseDiscount;
};

const calculateBulkAmount = (itemCount, totalAmount, subTotal) => {
  if (itemCount < CRITERIA.BULK) {
    return totalAmount;
  }
  const bulkDiscount = totalAmount * DISCOUNT.QUARTER;
  const productDiscount = subTotal - totalAmount;
  return bulkDiscount > productDiscount
    ? subTotal * (1 - DISCOUNT.QUARTER)
    : totalAmount;
};

export const calculateFinalAmount = (itemCount, totalAmount, subTotal) => {
  const baseAmount = calculateBulkAmount(itemCount, totalAmount, subTotal);
  return isTuesday() ? baseAmount * (1 - DISCOUNT.TEN_PERCENT) : baseAmount;
};
