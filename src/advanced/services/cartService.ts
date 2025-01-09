import { Product, CartItem, CartTotals } from "../types";
import { PRODUCT_DISCOUNTS } from "../constants";

export const calculateTotals = (
  cartItems: CartItem[],
  products: Product[]
): CartTotals => {
  const initialTotals: CartTotals = {
    subTotal: 0,
    totalAmount: 0,
    itemCount: 0,
    discount: 0,
  };

  return cartItems.reduce((totals, item) => {
    const product = products.find((p) => p.id === item.id);
    if (!product) return totals;

    const itemSubTotal = product.price * item.quantity;
    const discount = PRODUCT_DISCOUNTS[item.id] || 0;
    const itemDiscount = itemSubTotal * discount;

    return {
      subTotal: totals.subTotal + itemSubTotal,
      discount: totals.discount + itemDiscount,
      itemCount: totals.itemCount + item.quantity,
      totalAmount: totals.totalAmount + (itemSubTotal - itemDiscount),
    };
  }, initialTotals);
};
