import Product from '../types/product.ts';
import { isTuesday } from './utils.ts';

export const getTotalQuantity = (productList: Product[]) => productList.reduce((acc, product) => acc + product.quantity, 0);

export const calculateDiscount = (amount: number, total: number) => (total - amount) / total;

export const calculateBulkDiscount = ({ cartList, subTotal, totalAmount }: {
  cartList: Product[];
  totalAmount: number;
  subTotal: number;
}) => {
  const totalQuantity = getTotalQuantity(cartList);
  const itemDiscountRate = calculateDiscount(totalAmount, subTotal);

  if (totalQuantity >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      return 0.25;
    }
    return itemDiscountRate;
  }

  return itemDiscountRate;

};

export const calculateDiscountRateByDay = (discountRate: number) => {
  return isTuesday() ? Math.max(discountRate, 0.1) : discountRate;
};

const getDiscountRate = (product: Product) => {
  if (product.quantity < 10) {
    return 0;
  }
  const discountValueObject = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  } as const;

  return discountValueObject[product.id] ?? 0;
};

export const calculateTotalAmount = (productList: Product[]) => {
  return productList.map((product) => {
    const discountRate = getDiscountRate(product);
    return product.price * product.quantity * (1 - discountRate);
  }).reduce((acc, price) => acc + price, 0);
};


export const calculateTotalAmountByDay = (productList: Product[]) => {
  const totalAmount = calculateTotalAmount(productList);
  return isTuesday() ? totalAmount * (1 - 0.1) : totalAmount;
};

export const getTotalPrice = (productList: Product[]) => {
  return productList.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);
};

export const calculateFinalValues = (productList: Product[]) => {
  const subTotal = getTotalPrice(productList);
  const totalAmount = calculateTotalAmountByDay(productList);
  const discountRate = calculateDiscountRateByDay(calculateBulkDiscount({
    cartList: productList,
    subTotal,
    totalAmount,
  }));

  const finalPrice = subTotal * (1 - discountRate);


  return {
    discountRate,
    price: Number.isNaN(finalPrice) ? 0 : finalPrice,
  };
};
