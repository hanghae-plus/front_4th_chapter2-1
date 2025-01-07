import { combineStyles } from "../../../../utils";

export const ProductAddButton = () => {
  const $productAddButton = document.createElement("button");
  const productAddButtonId = "add-to-cart";
  const productAddButtonStyles = combineStyles(
    "bg-blue-500 text-white px-4 py-2 rounded",
  );
  const productAddButtonText = "추가";

  $productAddButton.id = productAddButtonId;
  $productAddButton.className = productAddButtonStyles;
  $productAddButton.textContent = productAddButtonText;
  return $productAddButton;
};
