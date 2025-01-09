import { combineStyles } from "../../../../utils";
import { addToCart } from "../../../../utils/product";

export const ProductAddButton = () => {
  const $productAddButton = document.createElement("button");
  const productAddButtonId = "add-to-cart";
  const productAddButtonText = "추가";
  const productAddButtonStyles = combineStyles(
    "bg-blue-500",
    "text-white",
    "px-4",
    "py-2",
    "rounded",
  );

  $productAddButton.id = productAddButtonId;
  $productAddButton.className = productAddButtonStyles;
  $productAddButton.textContent = productAddButtonText;

  $productAddButton.addEventListener("click", addToCart);

  return $productAddButton;
};
