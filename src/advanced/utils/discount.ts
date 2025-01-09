import { BULK_ORDER_QUANTITY, DISCOUNT_RATE } from '../constants/discount';
import { PRODUCTS } from '../constants/products';
import { CartItem } from '../types/cart';

export const calculateSubTotal = (cartList: CartItem[]): number => {
  const findProduct = cartList.reduce((total, item) => {
    const product = PRODUCTS.find((product) => product.id === item.productId);
    const price = product?.price || 0;

    return total + price * item.quantity;
  }, 0);

  return findProduct;
};

export const calculateWeekDiscount = (cartList: CartItem[]): number => {
  if (cartList.length === 0) {
    return 0;
  }

  const today = new Date();
  const day = today.getDay();

  if (DISCOUNT_RATE[`WEEK_DISCOUNT_${day}`]) {
    return DISCOUNT_RATE[`WEEK_DISCOUNT_${day}`];
  }
  return 0;
};

export const calculateBulkDiscount = (cartList: CartItem[]): number => {
  const totalQuantity = cartList.reduce((total, item) => total + item.quantity, 0);

  return totalQuantity >= BULK_ORDER_QUANTITY ? DISCOUNT_RATE.BULK_DISCOUNT : 0;
};
