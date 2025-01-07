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

  // calcCart();
  // updateSelOpts();

  //   setTimeout(function () {
  //     setInterval(function () {
  //       const luckyItem = prodList[Math.floor(Math.random() * prodList.length)];
  //       if (Math.random() < 0.3 && luckyItem.q > 0) {
  //         luckyItem.val = Math.round(luckyItem.val * 0.8);
  //         alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
  //         // updateSelOpts();
  //       }
  //     }, 30000);
  //   }, Math.random() * 10000);

  //   setTimeout(function () {
  //     setInterval(function () {
  //       if (lastSel) {
  //         const suggest = prodList.find(function (item) {
  //           return item.id !== lastSel && item.q > 0;
  //         });
  //         if (suggest) {
  //           alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
  //           suggest.val = Math.round(suggest.val * 0.95);
  //           // updateSelOpts();
  //         }
  //       }
  //     }, 60000);
  //   }, Math.random() * 20000);
  // }

  // // INFO: 보너스 포인트 함수
  // const renderBonusPts = () => {
  //   bonusPts = Math.floor(totalAmt / 1000);
  //   let ptsTag = document.getElementById('loyalty-points');
  //   if (!ptsTag) {
  //     ptsTag = document.createElement('span');
  //     ptsTag.id = 'loyalty-points';
  //     ptsTag.className = 'text-blue-500 ml-2';
  //     sum.appendChild(ptsTag);
  //   }
  //   ptsTag.textContent = '(포인트: ' + bonusPts + ')';
  // };

  // // INFO: 재고 알림 함수
  // function updateStockInfo() {
  //   let infoMsg = '';
  //   prodList.forEach(function (item) {
  //     if (item.q < 5) {
  //       infoMsg += item.name + ': ' + (item.q > 0 ? '재고 부족 (' + item.q + '개 남음)' : '품절') + '\n';
  //     }
  //   });
  //   stockInfo.textContent = infoMsg;
  // }
}

main();
