import { productList, selectedProduct, cartDisplay, lastPickProduct } from "../config/constants";

/**
 * 장바구니에 상품 추가
 */
export function addToCart() {
  const selectedId = selectedProduct.value; // 선택된 상품 ID
  const product = productList.find((p) => p.id === selectedId);

  if (product && product.quantity > 0) {
    let cartItem = document.getElementById(product.id);

    // 기존 항목 증가
    if (cartItem) {
      const quantity = parseInt(cartItem.querySelector("span").textContent.split("x ")[1]) + 1;
      if (quantity <= product.quantity) {
        cartItem.querySelector("span").textContent = `${product.name} - ${product.price}원 x ${quantity}`;
        product.quantity--;
      } else {
        alert("재고가 부족합니다."); // 재고 부족 알림
      }
    } else {
      // 새 항목 추가
      cartItem = createCartItem(product);
      cartDisplay.appendChild(cartItem);
      product.quantity--;
    }

    calculateCart(); // 장바구니 계산 업데이트
    lastPickProduct = selectedId; // 마지막 선택 상품 저장
  }
}