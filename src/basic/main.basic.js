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

import { createCartItemElement } from './renders/cartItem';
import { createCartItemsElement, renderCartItems } from './renders/cartItems';
import { createCartTotalElement, renderCartTotal } from './renders/cartTotal';
import { createContainerElement } from './renders/container';
import { createHeaderElement } from './renders/header';
import {
  createProductSelectElement,
  renderProductSelectOptionElement,
} from './renders/productSelect';
import {
  createStockStatusElement,
  renderStockStatus,
} from './renders/stockStatus';
import { createWrapElement } from './renders/warp';
import { CART_ITEMS } from './store/cartItems';
import { PRODUCT_LIST } from './store/productList';

export default function main() {
  let lastSelectedProductId;

  const $header = createHeaderElement();

  const $cartItems = createCartItemsElement();
  $cartItems.addEventListener('click', (event) => {
    const $targetElement = event.target;
    if (
      $targetElement.classList.contains('quantity-change') ||
      $targetElement.classList.contains('remove-item')
    ) {
      const productId = $targetElement.dataset.productId;
      const $cartItem = document.getElementById(productId);
      const cartItem = [...CART_ITEMS].find((item) => {
        return item.id === productId;
      });
      const product = PRODUCT_LIST.find((product) => {
        return product.id === productId;
      });
      if ($targetElement.classList.contains('quantity-change')) {
        const orderUnit = parseInt($targetElement.dataset.change);
        const newQuantity = cartItem.quantity + orderUnit;
        if (
          newQuantity > 0 &&
          newQuantity <= product.stock + cartItem.quantity
        ) {
          // renderCartItems({ cartItems: CART_ITEMS });를 사용하면 추가되면서 버튼이 새로 생성되면서, 테스트케이스가 실패함.
          $cartItem.querySelector('span').textContent =
            `${product.name} - ${product.price}원 x ${newQuantity}`;

          cartItem.quantity = newQuantity;
          product.stock -= orderUnit;
        } else if (newQuantity <= 0) {
          CART_ITEMS.forEach((item) => {
            if (item.id === productId) {
              CART_ITEMS.delete(item);
            }
          });
          renderCartItems({ cartItems: CART_ITEMS });

          product.stock -= orderUnit;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if ($targetElement.classList.contains('remove-item')) {
        product.stock += cartItem.quantity;
        CART_ITEMS.forEach((item) => {
          if (item.id === productId) {
            CART_ITEMS.delete(item);
          }
        });

        renderCartItems({ cartItems: CART_ITEMS });
      }
      renderCartTotal({ cartItems: CART_ITEMS });
      renderStockStatus({ productList: PRODUCT_LIST });
    }
  });

  const $cartTotal = createCartTotalElement();
  const $productSelect = createProductSelectElement();

  const $addButton = document.createElement('button');
  $addButton.id = 'add-to-cart';
  $addButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $addButton.textContent = '추가';
  $addButton.addEventListener('click', () => {
    const selectedProductId = $productSelect.value;
    const selectedProduct = PRODUCT_LIST.find((product) => {
      return product.id === selectedProductId;
    });
    if (selectedProduct && selectedProduct.stock > 0) {
      const $cartItem = document.getElementById(selectedProduct.id);
      if ($cartItem) {
        const cartItem = [...CART_ITEMS].find((item) => {
          return item.id === selectedProduct.id;
        });

        cartItem.quantity += 1;
        selectedProduct.stock--;

        renderCartItems({ cartItems: CART_ITEMS });
      } else {
        const newCartItem = {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: 1,
        };
        CART_ITEMS.add(newCartItem);

        const $newCartItem = createCartItemElement({ cartItem: newCartItem });
        $cartItems.appendChild($newCartItem);
        selectedProduct.stock--;
      }
      renderCartTotal({ cartItems: CART_ITEMS });
      renderStockStatus({ productList: PRODUCT_LIST });
      lastSelectedProductId = selectedProductId;
    } else {
      alert('재고가 부족합니다.');
    }
  });

  const $stockStatus = createStockStatusElement();

  const $wrap = createWrapElement();
  $wrap.appendChild($header);
  $wrap.appendChild($cartItems);
  $wrap.appendChild($cartTotal);
  $wrap.appendChild($productSelect);
  $wrap.appendChild($addButton);
  $wrap.appendChild($stockStatus);

  const $container = createContainerElement();
  $container.appendChild($wrap);

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
      if (lastSelectedProductId) {
        let suggest = PRODUCT_LIST.find(function (item) {
          return item.id !== lastSelectedProductId && item.stock > 0;
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
