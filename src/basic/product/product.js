import { state } from "../config/constants";

/**
 * 상품 선택 옵션 업데이트
 * - 상품 목록을 기반으로 드롭다운 옵션 생성
 * - 재고가 0인 상품은 선택 불가하도록 설정
 */
export function updatePickProduct() {
  state.selectedProduct.innerHTML = ""; // 기존 옵션 제거

  state.productList.forEach((product) => {
    const option= document.createElement("option");
    option.value = product.id; // 상품 ID 설정
    option.textContent = `${product.name} - ${product.price}원`; // 상품명 및 가격 표시
    option.disabled = product.quantity === 0; // 재고가 0일경우 비활성화
    state.selectedProduct.appendChild(option); // 옵션 추가
  });
}

/**
 * 장바구니 항목 생성
 */
export function createCartItem(product) {
  const item = document.createElement("div");
  item.id = product.id;
  item.className = "flex justify-between items-center mb-2";
  item.innerHTML = 
    `
    <span>${product.name} - ${product.price}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
    </div>
    `
  return item;
}

export function updateStockInfo() {
  const lowStockInfo = state.productList
    .filter((item) => item.quantity < state.constants.LOW_STOCK_THRESHOLD)
    .map((item) => `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : "품절"}`)
    .join("\n"); // 배열을 문자열로 변환할 때 각 요소를 줄바꿈 문자로 연결

  state.stockInfo.textContent = lowStockInfo;
}