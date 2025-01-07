import { calculateCart } from "../cart/cart";
import { state } from "../config/constants";

/**
 * 장바구니 액션 처리 (수량 변경, 삭제) 
 */
export function handleCartAction(e) {
  const target = e.target;
  const productId = target.dataset.productId;
  const product = state.productList.find((p) => p.id === productId);

  if (target.classList.contains("quantity-change")) {
    const change = parseInt(target.dataset.change);
    const cartItem = document.getElementById(productId);
    const currentQuantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);
    const newQuantity = currentQuantity + change;

    if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
      cartItem.querySelector("span").textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
      product.quantity -= change;
    } else if (newQuantity <= 0) {
      cartItem.remove();
      product.quantity += currentQuantity;
    } else if (change > 0) {
      alert("재고가 부족합니다.");
    }
  } else if (target.classList.contains("remove-item")) {
    const cartItem = document.getElementById(productId);
    const currentQuantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);

    product.quantity += currentQuantity;
    cartItem.remove();
  }

  calculateCart(); // 장바구니 업데이트
}