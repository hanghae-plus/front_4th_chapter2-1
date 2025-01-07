import { state } from "../config/constants";
import { updateStockInfo } from "../product/product";
import { displayTotal } from "../promotions/promotions";
import { getQuantityDiscount } from "../promotions/promotions";

/**
 * 장바구니에 상품 추가
 */
export function addToCart() {
  const selectedId = state.selectedProduct.value; // 선택된 상품 ID
  const product = state.productList.find((p) => p.id === selectedId);

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
      state.cartDisplay.appendChild(cartItem);
      product.quantity--;
    }

    calculateCart(); // 장바구니 계산 업데이트
    state.lastPickProduct = selectedId; // 마지막 선택 상품 저장
  }
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

/**
 * 장바구니 계산 함수
 * - 총액, 총 아이템 수 계산
 * - 대량 구매 할인 및 화요일 할인 적용
 */
export function calculateCart() {
  state.totalAmount = 0;
  state.totalItems = 0;

  const cartItems = Array.from(state.cartDisplay.children); // 장바구니 항목 가져오기
  let subTotal = 0;

  cartItems.forEach((item) => {
    const productId = item.id;
    const product = state.productList.find((p) => p.id === productId); // 상품 정보
    const quantity = parseInt(item.querySelector("span").textContent.split("x ")[1]); // 수량

    const itemTotal = product.price * quantity; // 항목 총액
    let discountRate = 0; // 개별 할인율

    // 대량 구매 할인 조건
    if (quantity >= 10) {
      discountRate = getQuantityDiscount(product.id);
    }

    state.totalItems += quantity; // 총 아이템 수 누적
    subTotal += itemTotal; // 소계 누적    
    state.totalAmount += itemTotal * (1 - discountRate); // 총액 계산
  });

  let dayDiscountApplied = false;
  let bulkDiscountApplied = false;

  // 대량 구매 할인 적용
  if (state.totalItems >= 30) {
    const bulkDiscount = subTotal * state.constants.BULK_DISCOUNT_RATE; // 대량 구매 할인 계산
    state.otalAmount -= bulkDiscount; // 총액에서 할인 차감
    bulkDiscountApplied = true;
  }

  // 화요일 할인 적용
  if (new Date().getDay() === state.constants.DISCOUNT_DAY) {
    state.totalAmount *= (1 - state.constants.DAY_DISCOUNT_RATE);
    dayDiscountApplied = true;
  }

  state.bonusPoints = Math.floor(state.totalAmount / state.constants.BONUS_POINT_DIVISOR); // 포인트 계산
  displayTotal(dayDiscountApplied, bulkDiscountApplied); // 결과 표시
  updateStockInfo(); // 재고 정보 업데이트
}
