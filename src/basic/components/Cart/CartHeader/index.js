import { combineStyles } from "../../../utils";

export const CartHeader = () => {
  let $cartHeaderTitle = document.createElement("h1");
  const cartHeaderStyles = combineStyles("text-2xl font-bold mb-4");
  const cartHeaderTextContent = "장바구니";

  $cartHeaderTitle.className = cartHeaderStyles;
  $cartHeaderTitle.textContent = cartHeaderTextContent;

  return $cartHeaderTitle;
};
