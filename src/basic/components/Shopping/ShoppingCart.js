// stockInfo
import { createElements } from "../../utils/createElements.js";

export default function ShoppingCart() {
  const shoppingCartProps = {
    tag: "div",
    id: "cart-items",
  };
  return createElements(shoppingCartProps);
}
