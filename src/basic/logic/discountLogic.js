import { DISCOUNT_RATES } from '../constant/constant.js';

export const calculateDiscounts = (items) => {
  const result = {
    totalAmount: 0,
    originalTotal: 0,
    itemCount: 0,
    discountRate: 0
  };

  items.forEach(({ item, selectedQuantity }) => {
    let discountRates = 0;
    const productTotal = item.price * selectedQuantity;

    result.itemCount += selectedQuantity;
    result.originalTotal += productTotal;

    if (selectedQuantity >= 10) {
      discountRates = DISCOUNT_RATES[item.id] || 0;
    }
    result.totalAmount += productTotal * (1 - discountRates);
    result.discountRate = discountRates;
  });

  if (result.itemCount >= 30) {
    const bulkDiscount = result.originalTotal * 0.25;
    const itemDiscount = result.originalTotal - result.totalAmount;

    if (bulkDiscount > itemDiscount) {
      result.totalAmount = result.originalTotal * 0.75;
      result.discountRate = 0.25;
    } else {
      result.discountRate =
        (result.originalTotal - result.totalAmount) / result.originalTotal;
    }
  }

  if (new Date().getDay() === 2) {
    result.totalAmount *= 0.9;
    result.discountRate = Math.max(result.discountRate, 0.1);
  }

  return result;
};
