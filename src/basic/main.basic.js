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
import { createHeaderElement } from './renders/header';
import { renderProductSelectOptionElement } from './renders/productSelect';
import { renderStockStatus } from './renders/stockStatus';
import { CART_ITEMS } from './store/cartItems';
import { PRODUCT_LIST } from './store/productList';

export default function main() {
  let lastSelectedProductId;

  const $header = createHeaderElement();

  const $cartItems = document.createElement('div');
  $cartItems.id = 'cart-items';
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
          $cartItem.querySelector('span').textContent =
            `${product.name} - ${product.price}원 x ${newQuantity}`;

          cartItem.quantity = newQuantity;
          product.stock -= orderUnit;
        } else if (newQuantity <= 0) {
          $cartItem.remove();

          CART_ITEMS.forEach((item) => {
            if (item.id === productId) {
              CART_ITEMS.delete(item);
            }
          });
          product.stock -= orderUnit;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if ($targetElement.classList.contains('remove-item')) {
        $cartItem.remove();

        product.stock += cartItem.quantity;
        CART_ITEMS.forEach((item) => {
          if (item.id === productId) {
            CART_ITEMS.delete(item);
          }
        });
      }
      renderCartTotal({ cartItems: CART_ITEMS });
      renderStockStatus({ productList: PRODUCT_LIST });
    }
  });

  const $cartTotal = document.createElement('div');
  $cartTotal.id = 'cart-total';
  $cartTotal.className = 'text-xl font-bold my-4';

  const $productSelect = document.createElement('select');
  $productSelect.id = 'product-select';
  $productSelect.className = 'border rounded p-2 mr-2';

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

        if (cartItem.quantity <= selectedProduct.stock) {
          $cartItem.querySelector('span').textContent =
            `${selectedProduct.name} - ${selectedProduct.price}원 x ${cartItem.quantity}`;

          selectedProduct.stock--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        const newCartItem = {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity: 1,
        };
        CART_ITEMS.add(newCartItem);

        const $newCartItem = document.createElement('div');
        $newCartItem.id = selectedProduct.id;
        $newCartItem.className = 'flex justify-between items-center mb-2';
        $newCartItem.innerHTML =
          '<span>' +
          selectedProduct.name +
          ' - ' +
          selectedProduct.price +
          '원 x 1</span><div>' +
          '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
          selectedProduct.id +
          '" data-change="-1">-</button>' +
          '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
          selectedProduct.id +
          '" data-change="1">+</button>' +
          '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
          selectedProduct.id +
          '">삭제</button></div>';
        $cartItems.appendChild($newCartItem);
        selectedProduct.stock--;
      }
      renderCartTotal({ cartItems: CART_ITEMS });
      renderStockStatus({ productList: PRODUCT_LIST });
      lastSelectedProductId = selectedProductId;
    }
  });

  const $stockStatus = document.createElement('div');
  $stockStatus.id = 'stock-status';
  $stockStatus.className = 'text-sm text-gray-500 mt-2';

  const $wrap = document.createElement('div');
  $wrap.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $wrap.appendChild($header);
  $wrap.appendChild($cartItems);
  $wrap.appendChild($cartTotal);
  $wrap.appendChild($productSelect);
  $wrap.appendChild($addButton);
  $wrap.appendChild($stockStatus);

  const $container = document.createElement('div');
  $container.className = 'bg-gray-100 p-8';
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
