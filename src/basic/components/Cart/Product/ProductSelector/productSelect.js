import { combineStyles } from "../../../../utils";

export const ProductSelect = () => {
  const $productSelect = document.createElement("select");
  const productSelectId = "product-select";
  const productSelectStyles = combineStyles("border rounded p-2 mr-2");

  $productSelect.id = productSelectId;
  $productSelect.className = productSelectStyles;

  return $productSelect;
};
