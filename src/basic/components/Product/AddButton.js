import { createElements } from "../../utils/createElements.js";

export default function AddButton() {
  return createElements({
    tag: "button",
    id: "add-to-cart",
    className: "bg-blue-500 text-white px-4 py-2 rounded",
    textContent: "추가",
  });
}
