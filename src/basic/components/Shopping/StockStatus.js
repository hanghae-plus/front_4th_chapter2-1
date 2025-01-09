import { createElements } from "../../utils/createElements.js";

export default function StockStatus() {
  return createElements({
    tag: "div",
    id: "stock-status",
    className: "text-sm text-gray-500 mt-2",
  });
}
