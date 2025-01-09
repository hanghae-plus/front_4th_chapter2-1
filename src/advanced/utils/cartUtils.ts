import { ProductItemType } from '../types';

export const calculateSubTotal = (cartItems: any[], productList: ProductItemType[]) => {
  return cartItems.reduce((subTotal, item) => {
    const currentItem = productList.find((p) => p.id === item.id);
    return currentItem ? subTotal + currentItem.price * item.quantity : subTotal;
  }, 0);
};

// 대량 구매 할인 적용
export const applyBulkDiscount = (
  subTotal: number,
  itemCount: number,
  threshold: number,
  rate: number,
) => {
  return itemCount >= threshold ? rate : 0;
};

// 상품별 할인 적용
export const applyProductDiscounts = (
  cartItems: any[],
  productList: ProductItemType[],
  discounts: any,
) => {
  return cartItems.reduce((discount, item) => {
    const product = productList.find((p) => p.id === item.id);
    if (product && item.quantity >= 10) {
      return discount + (discounts[product.name] || 0);
    }
    return discount;
  }, 0);
};
