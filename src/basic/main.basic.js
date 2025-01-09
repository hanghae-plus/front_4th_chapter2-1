import { appendChildren, createElement } from './utils/dom';
import { updateProductSelectOptions } from './services/updateProductSelectOptions';
import { applyRandomDiscount } from './services/applyRandomDiscount';
import { findRecommendItem } from './services/findRecommendItem';
import { alertIfRecommendedExist } from './services/alertIfRecommendedExist';
import { applyRecommendDiscount } from './services/applyRecommendDiscount';
import { setLazyInterval } from './utils/setLazyInterval';
import { getQuantityFromItemNode } from './services/getQuantityFromItemNode';
import { updateCartItemQuantity } from './services/updateCartItemQuantity';
import { updateQuantityInProductList } from './services/updateQuantityInProductList';
import { addNewItemToCart } from './services/addNewItemToCart';
import { createCartItemNameValueQuantityTemplate } from './services/createCartItemNameValueQuantityTemplate.ts';
import { getChangeButtonType } from './services/getChangeButtonType';
import { cloneDeep } from './utils/object';
import { productStore } from './stores/productStore';
import { $addButton } from './elements/addButton';
import { $stockInfo } from './elements/stockInfo';
import { $cartTotalAmount } from './elements/cartTotalAmount';
import { $cartDisplay } from './elements/cartDisplay';
import { $itemSelect } from './elements/itemSelect';
import { calcCart } from './services/calcCart';

let lastSelectedProductId;

function main() {
  const $root = document.getElementById('app');
  const $layout = createElement('div', {
    className: 'bg-gray-100 p-8',
  });
  const $cartContainer = createElement('div', {
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
  const $cartTitle = createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });

  appendChildren($cartContainer, [$cartTitle, $cartDisplay, $cartTotalAmount, $itemSelect, $addButton, $stockInfo]);
  $layout.appendChild($cartContainer);
  $root.appendChild($layout);

  updateProductSelectOptions($itemSelect);
  calcCart();

  setLazyInterval(
    () => {
      applyRandomDiscount($itemSelect);
    },
    { delay: Math.random() * 10000, interval: 30000 },
  );

  setLazyInterval(
    () => {
      const { getState, setState } = productStore;

      const productList = cloneDeep(getState());

      const suggest = findRecommendItem(productList, lastSelectedProductId);

      alertIfRecommendedExist(suggest);

      if (!suggest) return;

      const newProductList = applyRecommendDiscount(productList, suggest.id);

      setState(newProductList);

      updateProductSelectOptions($itemSelect);
    },
    { interval: 60000, delay: Math.random() * 20000 },
  );
}

const initializeEventHandler = () => {
  $addButton.addEventListener('click', (_event) => {
    const { getState, setState } = productStore;
    const productList = cloneDeep(getState());

    const selectedId = $itemSelect.value;

    const itemToAdd = productList.find((product) => product.id === selectedId);

    if (itemToAdd && itemToAdd.q <= 0) return;

    const $exitingItemInCart = document.getElementById(itemToAdd.id);

    if (!$exitingItemInCart) addNewItemToCart($cartDisplay, itemToAdd);

    if ($exitingItemInCart) {
      const updatedQuantity = getQuantityFromItemNode($exitingItemInCart) + 1;

      updatedQuantity <= itemToAdd.q
        ? updateCartItemQuantity({ $exitingItemInCart, itemToAdd, updatedQuantity })
        : alert('재고가 부족합니다.');
    }

    const newProductList = updateQuantityInProductList({ productList, selectedId, newQuantity: itemToAdd.q - 1 });
    setState(newProductList);

    calcCart();
    lastSelectedProductId = selectedId;
  });

  $cartDisplay.addEventListener('click', function (event) {
    const { getState, setState } = productStore;
    const newProductList = cloneDeep(getState());

    const { target: $target } = event;

    const productId = $target.dataset.productId;

    const $item = document.getElementById(productId);

    const targetProduct = newProductList.find(function (p) {
      return p.id === productId;
    });

    if (!targetProduct) throw Error('상품이 존재하지 않습니다.');

    const changeButtonType = getChangeButtonType($target);

    if (changeButtonType === 'plus-one') {
      const change = parseInt($target.dataset.change);
      const originQuantity = getQuantityFromItemNode($item);
      const newQuantity = originQuantity + change;
      const totalInStockQuantity = targetProduct.q + originQuantity;

      if (newQuantity < 0 || newQuantity > totalInStockQuantity) return alert('재고가 부족합니다.');

      if (newQuantity === 0) return $item.remove();

      $item.querySelector('span').textContent = createCartItemNameValueQuantityTemplate(
        targetProduct.name,
        targetProduct.val,
        newQuantity,
      );

      targetProduct.q -= change;
    }

    if (changeButtonType === 'minus-one') {
      const removeQuantity = parseInt($item.querySelector('span').textContent.split('x ')[1]);
      targetProduct.q += removeQuantity;
      $item.remove();
    }

    setState(newProductList);
    calcCart();
  });
};

main();
initializeEventHandler();
