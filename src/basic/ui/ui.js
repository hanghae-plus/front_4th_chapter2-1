import { addToCart } from "../cart/cart";
import { cartDisplay, totalDisplay, selectedProduct, addButton, stockInfo, root, container, wrapper, header } from "../config/constants";

/**
 * UI 설정 함수
 * - UI 요소 생성하고 DOM에 추가
 * - 버튼 및 장바구니 액션 이벤트 바인딩
 */
export function setupUI() {
  // 주요 UI 생성
  cartDisplay = document.createElement("div"); // 장바구니 항목 표시 영역
  totalDisplay = document.createElement("div"); // 총액 표시 영역
  selectedProduct = document.createElement("select"); // 상품 선택 드롭다운
  addButton = document.createElement("button"); // 장바구니 추가 버튼
  stockInfo = document.createElement("div"); // 재고 상태 표시 영역

  // UI 클래스 및 스타일 설정
  container.className='bg-gray-100 p-8';
  wrapper.className='max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  header.className='text-2xl font-bold mb-4';
  totalDisplay.className='text-xl font-bold my-4';
  selectedProduct.className='border rounded p-2 mr-2';
  addButton.className='bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className='text-sm text-gray-500 mt-2';

  // UI 요소 ID 설정
  cartDisplay.id='cart-items';
  totalDisplay.id='cart-total';
  selectedProduct.id='product-select';
  addButton.id='add-to-cart';
  stockInfo.id='stock-status';

  // UI 텍스트 설정
  header.textContent = "장바구니";
  addButton.textContent = "추가";
  
  // UI 요소 DOM에 추가
  wrapper.append(header, cartDisplay, totalDisplay, selectedProduct, addButton, stockInfo);
  container.appendChild(wrapper);
  root.appendChild(container);

  // 이벤트 바인딩
  addButton.addEventListener("click", addToCart); // 추가 버튼 클릭 이벤트
  cartDisplay.addEventListener("click", handleCartAction); // 장바구니 항목 이벤트
}