import { productList } from './data/productList.js';
import { calculateCartSummary } from './hooks/calculateCartSummary.js';
import createState from './hooks/createState.js';
import { updateProductOptions } from './hooks/updateProductOptions.js';

export const [getLastSelectedItem, setLastSelectedItem] = createState(null);
export const [getBonusPoints, setBonusPoints] = createState(0);
export const [getTotalAmount, setTotalAmount] = createState(0);
export const [getItemCount, setItemCount] = createState(0);
export const cartDisplay = document.createElement('div');
export const cartTotal = document.createElement('div');
export const selectedProduct = document.createElement('select');
const addToCartButton = document.createElement('button');
export const productStockInfo = document.createElement('div');

function main() {
  cartDisplay.id = 'cart-items';
  cartTotal.id = 'cart-total';
  cartTotal.className = 'text-xl font-bold my-4';

  selectedProduct.id = 'product-select';
  selectedProduct.className = 'border rounded p-2 mr-2';

  addToCartButton.id = 'add-to-cart';
  addToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addToCartButton.textContent = '추가';

  productStockInfo.id = 'stock-status';
  productStockInfo.className = 'text-sm text-gray-500 mt-2';

  //!지역 변수
  const rootElement = document.getElementById('app');

  const contentContainer = document.createElement('div');
  contentContainer.className = 'bg-gray-100 p-8';

  const headerTitle = document.createElement('h1');
  headerTitle.className = 'text-2xl font-bold mb-4';
  headerTitle.textContent = '장바구니';

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
        productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(function () {
    setInterval(function () {
      if (getLastSelectedItem()) {
        const suggest = productList.find(function (item) {
          return item.id !== getLastSelectedItem() && item.quantity > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
          );
          suggest.price = Math.round(suggest.price * 0.95);
          updateProductOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);

  updateProductOptions();
  calculateCartSummary();
}

main();

addToCartButton.addEventListener('click', function () {
  const selItem = selectedProduct.value;
  const itemToAdd = productList.find(function (p) {
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
    calculateCartSummary();
    setLastSelectedItem(selItem);
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
    const product = productList.find(function (p) {
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
    calculateCartSummary();
  }
});
