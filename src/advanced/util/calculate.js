import { PRODUCT_LIST } from "../data/prodList";

export const calculateCartTotals = (cartItems) => {
  let subTotal = 0;
  let totalDiscount = 0;
  let itemCount = 0;
  let discountRate = 0;
  cartItems.forEach((item) => {
    const curItem = PRODUCT_LIST.find((product) => product.id === item.id);
    const amount = parseInt(
      item.querySelector("span").textContent.split("x ")[1]
    );

    const itemTotalCost = curItem.cost * amount;
    discountRate = amount >= 10 ? curItem.discount : 0;

    subTotal += itemTotalCost;
    totalDiscount += itemTotalCost * discountRate;
    itemCount += amount;
  });
  return { subTotal, totalDiscount, itemCount, discountRate };
};
