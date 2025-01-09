import { cartStore, productStore } from "../../store";
import { updateCartState } from "../cart/updateCartState";
import { updateProductStock } from "./updateProductStock";

export const removeProduct = (productId) => {
  const $itemElement = document.getElementById(productId);
  if (!$itemElement) return;

  const currentQuantity = parseInt(
    $itemElement.querySelector("span")?.textContent?.split("x ")[1] || "0",
  );

  const products = productStore.get("products") || [];
  updateProductStock(products, productId, currentQuantity);

  $itemElement.remove();
  updateCartState(productId);
};
