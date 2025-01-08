/**
 * 1. 가독성.
 *  - 게슈탈트 원칙.
 *  - 위에서 아래로 읽기.
 *  - 적절한 공백
 *  - 프리티어
 * 2. 좋은 구조
 *  - 데이터 관점 보다는 역할 관점으로 묶기.
 * 3. 좋은 이름 짓기
 *  - push(), add(), insert(), new(), create(), append(), spawn()
 *  - get(), fetch(), from(), of()
 *  - current, selected
 *  - key, index
 *  - is, has
 */

/**
 * 좋은 이름, 좋은 구조, 좋은 모양
 * - rename!! → 빨리 끝나고 쉬운거, const
 * - 순서변경
 * - 파일 이동, 변경
 */

import { renderCartTotal } from './renders/cartTotal';
import { createContainerElement } from './renders/container';
import { renderProductSelectOptionElement } from './renders/productSelect';
import { renderStockStatus } from './renders/stockStatus';
import { CART_ITEMS } from './store/cartItems';
import { PRODUCT_LIST } from './store/productList';

export const lastSelectedProduct = { id: null };

export default function main() {
  const $container = createContainerElement();

  const $root = document.getElementById('app');
  $root.appendChild($container);

  renderProductSelectOptionElement({ productList: PRODUCT_LIST });
  renderCartTotal({ cartItems: CART_ITEMS });
  renderStockStatus({ productList: PRODUCT_LIST });

  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
      if (Math.random() < 0.3 && luckyItem.stock > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        renderProductSelectOptionElement({ productList: PRODUCT_LIST });
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct.id) {
        let suggest = PRODUCT_LIST.find(function (item) {
          return item.id !== lastSelectedProduct.id && item.stock > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.price = Math.round(suggest.price * 0.95);
          renderProductSelectOptionElement({ productList: PRODUCT_LIST });
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

main();
