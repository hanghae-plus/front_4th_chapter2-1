import { addToCart } from "../cart/cart";
import { handleCartAction } from "../events/handleEvent";
import { state, root, container, wrapper, header } from "../config/constants";

/**
 * UI 설정 함수
 * - UI 요소 생성하고 DOM에 추가
 * - 버튼 및 장바구니 액션 이벤트 바인딩
 */
export function setupUI() {
  // 주요 UI 생성
  state.cartDisplay = document.createElement("div"); // 장바구니 항목 표시 영역
  state.totalDisplay = document.createElement("div"); // 총액 표시 영역
  state.selectedProduct = document.createElement("select"); // 상품 선택 드롭다운
  state.addButton = document.createElement("button"); // 장바구니 추가 버튼
  state.stockInfo = document.createElement("div"); // 재고 상태 표시 영역

  // UI 클래스 및 스타일 설정
  container.className='bg-gray-100 p-8';
  wrapper.className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  header.className='text-2xl font-bold mb-4';
  state.totalDisplay.className='text-xl font-bold my-4';
  state.selectedProduct.className='border rounded p-2 mr-2';
  state.addButton.className='bg-blue-500 text-white px-4 py-2 rounded';
  state.stockInfo.className='text-sm text-gray-500 mt-2';

  // UI 요소 ID 설정
  state.cartDisplay.id='cart-items';
  state.totalDisplay.id='cart-total';
  state.selectedProduct.id='product-select';
  state.addButton.id='add-to-cart';
  state.stockInfo.id='stock-status';

  // UI 텍스트 설정
  header.textContent = "장바구니";
  state.addButton.textContent = "추가";
  
  // UI 요소 DOM에 추가
  wrapper.append(header, state.cartDisplay, state.totalDisplay, state.selectedProduct, state.addButton, state.stockInfo);
  container.appendChild(wrapper);
  root.appendChild(container);

  // 이벤트 바인딩
  state.addButton.addEventListener("click", addToCart); // 추가 버튼 클릭 이벤트
  state.cartDisplay.addEventListener("click", handleCartAction); // 장바구니 항목 이벤트
}