import { render } from './lib/renderElement.js';
import { productStore } from './stores/productStore.js';
import { registerGlobalEvents } from './lib/eventManager.js';

function main() {
  productStore.subscribe(render);

  // HTML 생성
  render();

  registerGlobalEvents();

  // setTimeout 함수
  setTimeout(function () {
    const { productList } = productStore.getState();

    setInterval(function () {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
      }
    }, 30000);
  }, Math.random() * 10000);
  setTimeout(function () {
    const { productList, lastSelectedProductId } = productStore.getState();

    setInterval(function () {
      if (lastSelectedProductId) {
        const suggest = productList.find(function (item) {
          return item.id !== lastSelectedProductId && item.quantity > 0;
        });
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * 0.95);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
  // ======================================================= //
}

main();
