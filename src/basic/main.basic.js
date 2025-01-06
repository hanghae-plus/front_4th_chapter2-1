import Header from './components/Header';
import { getTotalBonusPoints } from './components/points/getTotalBonusPoints';
import { renderBonusPoints } from './components/points/renderBonusPoints';
import { updateStockInfoMessage } from './components/stock/updateStockInfoMessage';
import { CONSTANTS } from './constants';
import { helper } from './utils/helper';

let products,
  productSelector,
  addToCartButton,
  cartDisplay,
  totalDisplay,
  stockInfo,
  lastSelectedItem;
let totalAmount = 0,
  itemCount = 0;

function main() {
  products = [
    { id: 'p1', name: '상품1', price: 10_000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20_000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30_000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15_000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25_000, quantity: 10 },
  ];

  const contentWrapper = document.createElement('div');
  contentWrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  const header = Header({ title: '장바구니' });
  contentWrapper.appendChild(header);

  cartDisplay = document.createElement('div');
  cartDisplay.id = 'cart-items';
  contentWrapper.appendChild(cartDisplay);

  totalDisplay = document.createElement('div');
  totalDisplay.id = 'cart-total';
  totalDisplay.className = 'text-xl font-bold my-4';
  contentWrapper.appendChild(totalDisplay);

  productSelector = document.createElement('select');
  productSelector.id = 'product-select';
  productSelector.className = 'border rounded p-2 mr-2';
  contentWrapper.appendChild(productSelector);

  addToCartButton = document.createElement('button');
  addToCartButton.id = 'add-to-cart';
  addToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addToCartButton.textContent = '추가';
  contentWrapper.appendChild(addToCartButton);

  stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-sm text-gray-500 mt-2';
  contentWrapper.appendChild(stockInfo);

  const containerDiv = document.createElement('div');
  containerDiv.className = 'bg-gray-100 p-8';
  containerDiv.appendChild(contentWrapper);

  const root = document.getElementById('app');
  root.appendChild(containerDiv);

  updateSelectOptions();
  calculateCart();

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      if (
        Math.random() < CONSTANTS.RANDOM_SALE_RATE &&
        luckyItem.quantity > 0
      ) {
        luckyItem.price = Math.round(
          luckyItem.price * CONSTANTS.LIGHTNING_SALE_RATE,
        );
        alert(helper.getLightningSaleMessage(luckyItem.name));
        updateSelectOptions();
      }
    }, CONSTANTS.LIGHTNING_SALE_INTERVAL);
  }, Math.random() * CONSTANTS.LIGHTNING_SALE_DELAY);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedItem) {
        const suggest = products.find(function (item) {
          return item.id !== lastSelectedItem && item.quantity > 0;
        });

        if (suggest) {
          alert(helper.getSuggestionMessage(suggest.name));
          suggest.price = Math.round(
            suggest.price * CONSTANTS.SUGGESTION_DISCOUNT_RATE,
          );
          updateSelectOptions();
        }
      }
    }, CONSTANTS.SUGGESTION_INTERVAL);
  }, Math.random() * CONSTANTS.SUGGESTION_DELAY);
}

function updateSelectOptions() {
  productSelector.innerHTML = '';
  products.forEach(function (item) {
    const selectOption = document.createElement('option');

    selectOption.value = item.id;
    selectOption.textContent = helper.getNameAndPriceMessage(
      item.name,
      item.price,
    );
    if (item.quantity === 0) selectOption.disabled = true;

    productSelector.appendChild(selectOption);
  });
}

function calculateCart() {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = cartDisplay.children;
  let preDiscountTotal = 0; // 할인 적용 전 총액

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentProduct;
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          currentProduct = products[j];
          break;
        }
      }

      const quantity = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      const currentProductAmount = currentProduct.price * quantity;

      let discountRate = 0;
      itemCount += quantity;
      preDiscountTotal += currentProductAmount;

      if (
        quantity >= CONSTANTS.QUANTITY_THRESHOLD &&
        CONSTANTS.DISCOUNT_RATES[currentProduct.id]
      ) {
        discountRate = CONSTANTS.DISCOUNT_RATES[currentProduct.id];
      }
      totalAmount += currentProductAmount * (1 - discountRate);
    })();
  }

  let overallDiscountRate = 0;
  if (itemCount >= CONSTANTS.BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = totalAmount * CONSTANTS.BULK_DISCOUNT_RATE;
    const itemDiscount = preDiscountTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = preDiscountTotal * (1 - CONSTANTS.BULK_DISCOUNT_RATE);
      overallDiscountRate = CONSTANTS.BULK_DISCOUNT_RATE;
    } else {
      overallDiscountRate = (preDiscountTotal - totalAmount) / preDiscountTotal;
    }
  } else {
    overallDiscountRate = (preDiscountTotal - totalAmount) / preDiscountTotal;
  }

  if (new Date().getDay() === CONSTANTS.WEEKLY_DISCOUNT_DAY) {
    totalAmount *= 1 - CONSTANTS.WEEKLY_DISCOUNT_RATE;
    overallDiscountRate = Math.max(
      overallDiscountRate,
      CONSTANTS.WEEKLY_DISCOUNT_RATE,
    );
  }

  const roundedAmount = Math.round(totalAmount);
  totalDisplay.textContent = helper.getTotalAmountMessage(roundedAmount);

  if (overallDiscountRate > 0) {
    const discountSpan = document.createElement('span');
    discountSpan.className = 'text-green-500 ml-2';
    const discountedAmount = (overallDiscountRate * 100).toFixed(1);
    discountSpan.textContent =
      helper.getDiscountedAmountMessage(discountedAmount);
    totalDisplay.appendChild(discountSpan);
  }

  const updatedMessage = updateStockInfoMessage(products);
  stockInfo.textContent = updatedMessage;
  const bonusPoints = getTotalBonusPoints(totalAmount);
  renderBonusPoints(bonusPoints);
}

main();

addToCartButton.addEventListener('click', function () {
  const selectedItem = productSelector.value;
  const productToAdd = products.find(function (p) {
    return p.id === selectedItem;
  });

  if (productToAdd && productToAdd.quantity > 0) {
    const product = document.getElementById(productToAdd.id);

    if (product) {
      const newQuantity =
        parseInt(product.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQuantity <= productToAdd.quantity) {
        product.querySelector('span').textContent =
          productToAdd.name +
          ' - ' +
          productToAdd.price +
          '원 x ' +
          newQuantity;
        productToAdd.quantity--;
      } else {
        alert(CONSTANTS.OUT_OF_STOCK_MESSAGE);
      }
    } else {
      const newProduct = document.createElement('div');
      newProduct.id = productToAdd.id;
      newProduct.className = 'flex justify-between items-center mb-2';
      newProduct.innerHTML =
        '<span>' +
        productToAdd.name +
        ' - ' +
        productToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        productToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        productToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        productToAdd.id +
        '">삭제</button></div>';

      cartDisplay.appendChild(newProduct);
      productToAdd.quantity--;
    }

    calculateCart();
    lastSelectedItem = selectedItem;
  }
});

cartDisplay.addEventListener('click', function (event) {
  const targetElement = event.target;
  if (
    targetElement.classList.contains('quantity-change') ||
    targetElement.classList.contains('remove-item')
  ) {
    const productId = targetElement.dataset.productId;
    const cartProductElement = document.getElementById(productId);
    const selectedProduct = products.find(function (product) {
      return product.id === productId;
    });

    if (targetElement.classList.contains('quantity-change')) {
      const quantityChange = parseInt(targetElement.dataset.change);
      const newQuantity =
        parseInt(
          cartProductElement.querySelector('span').textContent.split('x ')[1],
        ) + quantityChange;

      if (
        newQuantity > 0 &&
        newQuantity <=
          selectedProduct.quantity +
            parseInt(
              cartProductElement
                .querySelector('span')
                .textContent.split('x ')[1],
            )
      ) {
        cartProductElement.querySelector('span').textContent =
          cartProductElement.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQuantity;
        selectedProduct.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        cartProductElement.remove();
        selectedProduct.quantity -= quantityChange;
      } else {
        alert(CONSTANTS.OUT_OF_STOCK_MESSAGE);
      }
    } else if (targetElement.classList.contains('remove-item')) {
      const removedQuantity = parseInt(
        cartProductElement.querySelector('span').textContent.split('x ')[1],
      );
      selectedProduct.quantity += removedQuantity;
      cartProductElement.remove();
    }

    calculateCart();
  }
});
