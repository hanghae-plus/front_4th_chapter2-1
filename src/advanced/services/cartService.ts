import { Product, CartItem, CartTotalList } from "../types";
import { PRODUCT_DISCOUNTS } from "../constants";

export const calculateTotalList = (
  cartItemList: CartItem[],
  productList: Product[]
): CartTotalList => {
  const initialTotalList: CartTotalList = {
    subTotal: 0,
    totalAmount: 0,
    itemCount: 0,
    discount: 0,
  };

  return cartItemList.reduce((totalList, item) => {
    const product = productList.find((p) => p.id === item.id);
    if (!product) return totalList;

    const itemSubTotal = product.price * item.quantity;
    const discount = PRODUCT_DISCOUNTS[item.id] || 0;
    const itemDiscount = itemSubTotal * discount;

    return {
      subTotal: totalList.subTotal + itemSubTotal,
      discount: totalList.discount + itemDiscount,
      itemCount: totalList.itemCount + item.quantity,
      totalAmount: totalList.totalAmount + (itemSubTotal - itemDiscount),
    };
  }, initialTotalList);
};
