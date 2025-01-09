import { itemList } from "../../constants/constants.js";
import { createElements } from "../../utils/createElements.js";

export default function ProductOptions() {
  const selectBox = document.createElement("select");
  selectBox.id = "product-select";
  selectBox.className = "border rounded p-2 mr-2";
  selectBox.append(
    createElements(
      itemList.map((product) => ({
        tag: "option",
        value: product.id,
        textContent: `${product.name} - ${product.price}원`,
        disabled: !product.qty,
      })),
    ),
  );
  return selectBox;
}
