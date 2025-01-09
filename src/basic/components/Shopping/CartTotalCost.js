import { createElements } from "../../utils/createElements.js";

export default function CartTotalCost() {
  return createElements({
    tag: "div",
    id: "cart-total",
    className: "text-xl font-bold my-4",
  });
}
