import { calculateCart } from "../cart/cart";
import { state } from "../config/constants";

/**
 * 장바구니 액션 처리 (수량 변경, 삭제) 
 */
export function handleCartAction(e) {
  const target = e.target;
  const productId = target.dataset.productId;
  const product = state.productList.find((p) => p.id === productId); // 해당 상품 ID로 상품 데이터 검색

  // 사용자가 상품 수량 변경 버튼을 클릭했을 경우
  if (target.classList.contains("quantity-change")) {
    const change = parseInt(target.dataset.change); // 수량 변경 값 (+1 또는 -1)
    const cartItem = document.getElementById(productId);
    const currentQuantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]); // 현재 수량 추출
    const newQuantity = currentQuantity + change; // 새로운 수량 계산

    if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
      // 수량이 0 이상이고, 재고 한도를 넘지 않을 경우
      cartItem.querySelector("span").textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
      product.quantity -= change; // 상품 재고 업데이트
    } else if (newQuantity <= 0) {
      // 수량이 0 이하일 경우: 장바구니에서 해당 상품 제거
      cartItem.remove();
      product.quantity += currentQuantity; // 상품 재고 복구
    } else if (change > 0) {
      alert("재고가 부족합니다.");
    }
  } else if (target.classList.contains("remove-item")) { // 사용자가 상품 삭제 버튼을 클릭했을 경우
    const cartItem = document.getElementById(productId);
    const currentQuantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]);

    product.quantity += currentQuantity;
    cartItem.remove();
  }

  calculateCart(); // 장바구니 업데이트
}