import { combineStyles } from "../../../../utils";

export const CartSummary = () => {
  const $cartSummary = document.createElement("div");
  const cartSummaryId = "cart-total";
  const cartSummaryStyles = combineStyles("text-xl font-bold my-4");

  $cartSummary.id = cartSummaryId;
  $cartSummary.className = cartSummaryStyles;

  return $cartSummary;
};
