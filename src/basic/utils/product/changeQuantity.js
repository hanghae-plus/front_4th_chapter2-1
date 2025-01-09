import { productStore } from "../../store";
import { updateCartState } from "../cart/updateCartState";
import { updateProductStock } from "./updateProductStock";

export const changeQuantity = (productId, change) => {
  const $itemElement = document.getElementById(productId);
  if (!$itemElement) return;

  const products = productStore.get("products") || [];
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const currentQuantity = parseInt(
    $itemElement.querySelector("span")?.textContent?.split("x ")[1] || "0",
  );
  const newQuantity = currentQuantity + change;

  // 수량이 0 이하면 삭제
  if (newQuantity <= 0) {
    $itemElement.remove();
    updateProductStock(products, productId, currentQuantity);
    updateCartState(productId);
    return;
  }

  // 재고 체크
  if (newQuantity > product.stock + currentQuantity) {
    alert("재고가 부족합니다.");
    return;
  }

  // 수량 업데이트
  $itemElement.querySelector("span").textContent =
    `${product.name} - ${product.price}원 x ${newQuantity}`;

  updateProductStock(products, productId, -change);
  updateCartState(productId);
};
