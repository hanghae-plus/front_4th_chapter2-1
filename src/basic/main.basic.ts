/**
 * @description
 * INFO에 기준으로 각 역할 정의
 *
 * 리스트
 * INFO: Main
 * INFO: 옵션 수정 함수
 * INFO: 카트 계산 로직 함수
 * INFO: 보너스 포인트 함수
 * INFO: 재고 알림 함수
 * INFO: Main 함수 호출
 * INFO: "추가" 버튼 클릭 핸들러
 * INFO: 카트 제거 버튼
 *
 * 컴포넌트와 해당 관심사 별로 분리
 *
 */

import { Cart } from './components/cart/Cart';
import { ProductSelector } from './components/product-selector/ProductSelector';
import { TotalPrice } from './components/total-price/TotalPrice';
import { CartStore } from './store/cartStore';
import { ProductStore } from './store/productStore';

// INFO: Main
function main() {
  const render = () => {
    const root = document.getElementById('app');

    if (!root) return;

    root.innerHTML = `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        ${Cart().render}
        ${TotalPrice().render}
        ${ProductSelector().render}
        <div class="text-sm text-gray-500 mt-2">재고</div>
      </div>
    </div>
    `;
  };

  render();
  CartStore.subscribe(() => render());
  ProductStore.subscribe(() => render());
}

main();
