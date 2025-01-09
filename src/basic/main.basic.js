import { PRODUCT_LIST } from './const/constance.js';
import { createCartDisplay } from './components/CartDisplay.js';
import { createCartTotal } from './components/CartTotal.js';
import { createProductSelector } from './components/ProductSelector.js';
import { createAddToCartButton } from './components/AddToCartButton.js';
import { createProductStockInfo } from './components/ProductStockInfo.js';
import { createHeaderTitle } from './components/HeaderTitle.js';

let lastSelectedItem,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

let cartDisplay,
  cartTotal,
  selectedProduct,
  addToCartButton,
  productStockInfo,
  headerTitle;

function main() {
  cartDisplay = createCartDisplay();
  cartTotal = createCartTotal();
  selectedProduct = createProductSelector();
  addToCartButton = createAddToCartButton();
  productStockInfo = createProductStockInfo();
  headerTitle = createHeaderTitle();

  const rootElement = document.getElementById('app');

  const contentContainer = document.createElement('div');
  contentContainer.className = 'bg-gray-100 p-8';

  const wrapper = document.createElement('div');
  wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  wrapper.appendChild(headerTitle);
  wrapper.appendChild(cartDisplay);
  wrapper.appendChild(cartTotal);
  wrapper.appendChild(selectedProduct);
  wrapper.appendChild(addToCartButton);
  wrapper.appendChild(productStockInfo);
  contentContainer.appendChild(wrapper);
  rootElement.appendChild(contentContainer);

  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedItem) {
        const suggest = PRODUCT_LIST.find(function (item) {
          return item.id !== lastSelectedItem && item.quantity > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);

  updateSelOpts();
  calcCart();
}

function updateSelOpts() {
  selectedProduct.innerHTML = '';
  PRODUCT_LIST.forEach(function (item) {
    const optionElement = document.createElement('option');
    optionElement.value = item.id;
    optionElement.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) optionElement.disabled = true;
    selectedProduct.appendChild(optionElement);
  });
}

function calcCart() {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = cartDisplay.children;
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
  cartTotal.textContent = '총액: ' + Math.round(totalAmount) + '원';
  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotal.appendChild(span);
  }
  updateStockInfo();
  renderBonusPts();
}

const renderBonusPts = () => {
  bonusPoints = Math.floor(totalAmount / 1000);
  let bonusPointsElement = document.getElementById('loyalty-points');
  if (!bonusPointsElement) {
    bonusPointsElement = document.createElement('span');
    bonusPointsElement.id = 'loyalty-points';
    bonusPointsElement.className = 'text-blue-500 ml-2';
    cartTotal.appendChild(bonusPointsElement);
  }
  bonusPointsElement.textContent = '(포인트: ' + bonusPoints + ')';
};

function updateStockInfo() {
  let infoMessage = '';
  PRODUCT_LIST.forEach(function (item) {
    if (item.quantity < 5) {
      infoMessage +=
        item.name +
        ': ' +
        (item.quantity > 0
          ? '재고 부족 (' + item.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  productStockInfo.textContent = infoMessage;
}

main();

addToCartButton.addEventListener('click', function () {
  const selItem = selectedProduct.value;
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
      cartDisplay.appendChild(newItem);
      itemToAdd.quantity--;
    }
    calcCart();
    lastSelectedItem = selItem;
  }
});

cartDisplay.addEventListener('click', function (event) {
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
    calcCart();
  }
});
