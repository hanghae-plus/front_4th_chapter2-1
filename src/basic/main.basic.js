import { PRODUCT_LIST } from './const/constance.js';
import { createCartDisplay } from './components/cartDisplay.js';
import { createCartTotal } from './components/cartTotal.js';
import { createProductSelector } from './components/productSelector.js';
import { createAddToCartButton } from './components/addToCartButton.js';
import { createProductStockInfo } from './components/productStockInfo.js';
import { createHeaderTitle } from './components/headerTitle.js';
import { startLuckySales } from './hooks/startLuckySales.js';
import { useState } from './hooks/useState.js';
import { startPromotions } from './hooks/startPromotions.js';
import { updateProductOptions } from './hooks/updateProductOptions.js';
import { updateStockInfo } from './hooks/updateStockInfo.js';

export const [getLastSelectedItem, setLastSelectedItem] = useState(null);

export const [getSelectedProduct, setSelectedProduct] = useState(
  createProductSelector(),
);
export const [getCartDisplay, setCartDisplay] = useState(createCartDisplay());
export const [getCartTotal, setCartTotal] = useState(createCartTotal());
export const [getProductStockInfo, setProductStockInfo] = useState(
  createProductStockInfo(),
);
let addToCartButton, headerTitle;

export let totalAmount = 0;
export let itemCount = 0;
export let bonusPoints = 0;

function main() {
  // 컴포넌트 초기화

  addToCartButton = createAddToCartButton();
  headerTitle = createHeaderTitle();

  //UI 설정
  const rootElement = document.getElementById('app');
  const contentContainer = document.createElement('div');
  contentContainer.className = 'bg-gray-100 p-8';

  const wrapper = document.createElement('div');
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  [
    headerTitle,
    getCartDisplay,
    getCartTotal,
    getSelectedProduct,
    addToCartButton,
    getProductStockInfo,
  ].forEach((component) => wrapper.appendChild(component));

  contentContainer.appendChild(wrapper);
  rootElement.appendChild(contentContainer);

  startLuckySales();
  startPromotions();
  updateProductOptions();
  calculatorCart();
}

function calculatorCart() {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = getCartDisplay.children;
  let subTotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentItem;
      for (let j = 0; j < PRODUCT_LIST.length; j++) {
        if (PRODUCT_LIST[j].id === cartItems[i].id) {
          currentItem = PRODUCT_LIST[j];
          break;
        }
      }
      const quantity = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      const itemTotal = currentItem.price * quantity;
      let discount = 0;
      itemCount += quantity;
      subTotal += itemTotal;
      if (quantity >= 10) {
        if (currentItem.id === 'p1') discount = 0.1;
        else if (currentItem.id === 'p2') discount = 0.15;
        else if (currentItem.id === 'p3') discount = 0.2;
        else if (currentItem.id === 'p4') discount = 0.05;
        else if (currentItem.id === 'p5') discount = 0.25;
      }
      totalAmount += itemTotal * (1 - discount);
    })();
  }
  let discountRate = 0;
  if (itemCount >= 30) {
    const bulkDiscount = totalAmount * 0.25;
    const itemDiscount = subTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }
  getCartTotal.textContent = '총액: ' + Math.round(totalAmount) + '원';
  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    getCartTotal.appendChild(span);
  }
  updateStockInfo();
  renderBonusPoints();
}
const renderBonusPoints = () => {
  bonusPoints = Math.floor(totalAmount / 1000);
  let bonusPointsElement = document.getElementById('loyalty-points');
  if (!bonusPointsElement) {
    bonusPointsElement = document.createElement('span');
    bonusPointsElement.id = 'loyalty-points';
    bonusPointsElement.className = 'text-blue-500 ml-2';
    getCartTotal.appendChild(bonusPointsElement);
  }
  bonusPointsElement.textContent = '(포인트: ' + bonusPoints + ')';
};

main();

addToCartButton.addEventListener('click', function () {
  const selItem = getSelectedProduct.value;
  const itemToAdd = PRODUCT_LIST.find(function (p) {
    return p.id === selItem;
  });
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQuantity =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQuantity <= itemToAdd.quantity) {
        item.querySelector('span').textContent =
          itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQuantity;
        itemToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = itemToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        itemToAdd.name +
        ' - ' +
        itemToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        itemToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        itemToAdd.id +
        '">삭제</button></div>';
      getCartDisplay.appendChild(newItem);
      itemToAdd.quantity--;
    }
    calculatorCart();

    setLastSelectedItem(selItem);
  }
});

getCartDisplay.addEventListener('click', function (event) {
  const target = event.target;
  if (
    target.classList.contains('quantity-change') ||
    target.classList.contains('remove-item')
  ) {
    const productID = target.dataset.productId;
    const itemElement = document.getElementById(productID);
    const product = PRODUCT_LIST.find(function (p) {
      return p.id === productID;
    });
    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);
      const newQuantity =
        parseInt(itemElement.querySelector('span').textContent.split('x ')[1]) +
        quantityChange;
      if (
        newQuantity > 0 &&
        newQuantity <=
          product.quantity +
            parseInt(
              itemElement.querySelector('span').textContent.split('x ')[1],
            )
      ) {
        itemElement.querySelector('span').textContent =
          itemElement.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQuantity;
        product.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        itemElement.remove();
        product.quantity -= quantityChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      const removeQuantity = parseInt(
        itemElement.querySelector('span').textContent.split('x ')[1],
      );
      product.quantity += removeQuantity;
      itemElement.remove();
    }
    calculatorCart();
  }
});
