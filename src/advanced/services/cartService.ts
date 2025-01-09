import { Product, CartItem, CartTotalList } from "../types";
import { PRODUCT_DISCOUNT_LIST } from "../constants";

export const calcTotalList = (
  cartItemList: CartItem[],
  productList: Product[]
): CartTotalList => {
  const initialTotalList: CartTotalList = {
    subTotal: 0,
    totalAmt: 0,
    itemCnt: 0,
    discount: 0,
  };

  return cartItemList.reduce((totalList, item) => {
    const product = productList.find((p) => p.id === item.id);
    if (!product) return totalList;

    const itemSubTotal = product.price * item.qty;
    const discount = PRODUCT_DISCOUNT_LIST[item.id] || 0;
    const itemDiscount = itemSubTotal * discount;

    return {
      subTotal: totalList.subTotal + itemSubTotal,
      discount: totalList.discount + itemDiscount,
      itemCnt: totalList.itemCnt + item.qty,
      totalAmt: totalList.totalAmt + (itemSubTotal - itemDiscount),
    };
  }, initialTotalList);
};
