import { products } from './data/products';
import { DISCOUNT_POLICY, STOCK_POLICY, TIMER_POLICY } from './features/cart/constants/policy';
import { applyDiscount } from './features/cart/utils/discount';

let productSelector, cartItemContainer, cartTotal;

const ELEMENT_IDS = {
  STOCK_STATUS: 'stock-status',
  ADD_TO_CART: 'add-to-cart',
};

const getStockStatusElement = () => document.getElementById(ELEMENT_IDS.STOCK_STATUS);
const getAddCartButtonElement = () => document.getElementById(ELEMENT_IDS.ADD_TO_CART);

let lastSelectedProduct,
  points = 0,
  amount = 0,
  itemCount = 0;

const main = () => {
  const root = document.getElementById('app');
  const container = document.createElement('div');
  const wrapper = document.createElement('div');
  const headerText = document.createElement('h1');
  cartItemContainer = document.createElement('div');
  cartTotal = document.createElement('div');
  productSelector = document.createElement('select');

  cartItemContainer.id = 'cart-items';
  cartTotal.id = 'cart-total';
  productSelector.id = 'product-select';

  container.className = 'bg-gray-100 p-8';
  wrapper.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  headerText.className = 'text-2xl font-bold mb-4';
  cartTotal.className = 'text-xl font-bold my-4';
  productSelector.className = 'border rounded p-2 mr-2';

  headerText.textContent = '장바구니';
  updateProductList();
  wrapper.appendChild(headerText);
  wrapper.appendChild(cartItemContainer);
  wrapper.appendChild(cartTotal);
  wrapper.appendChild(productSelector);

  wrapper.insertAdjacentHTML(
    'beforeend',
    /* html */ `<button id="${ELEMENT_IDS.ADD_TO_CART}" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>`,
  );
  wrapper.insertAdjacentHTML('beforeend', /* html */ `<div id="stock-status" class="text-sm text-gray-500 mt-2" />`);

  container.appendChild(wrapper);
  root.appendChild(container);
  calcCart();
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = products[Math.floor(Math.random() * products.length)];
      if (Math.random() < DISCOUNT_POLICY.LIGHTNING_SALE_RATE_PROBABILITY && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * (1 - DISCOUNT_POLICY.LIGHTNING_SALE_RATE));
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateProductList();
      }
    }, TIMER_POLICY.LIGHTNING_SALE_RATE_INTERVAL);
  }, Math.random() * 10000);
  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedProduct) {
        const suggest = products.find((item) => item.id !== lastSelectedProduct && item.quantity > 0);
        if (suggest) {
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * (1 - DISCOUNT_POLICY.RECOMMENDATION_DISCOUNT_RATE));
          updateProductList();
        }
      }
    }, TIMER_POLICY.PRODUCT_RECOMMENDATION_INTERVAL);
  }, Math.random() * 20000);
};

const updateProductList = () => {
  productSelector.innerHTML = '';
  products.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name + ' - ' + item.price + '원';

    if (item.quantity === 0) {
      option.disabled = true;
    }

    productSelector.appendChild(option);
  });
};

const calcCart = () => {
  amount = 0;
  itemCount = 0;
  const cartItems = cartItemContainer.children;
  let subTotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (() => {
      let currentProduct;
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          currentProduct = products[j];
          break;
        }
      }
      const quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
      const itemAmount = currentProduct.price * quantity;
      let discountRate = 0;
      itemCount += quantity;
      subTotal += itemAmount;
      if (quantity >= DISCOUNT_POLICY.MIN_QUANTITY_FOR_DISCOUNT) {
        discountRate = DISCOUNT_POLICY.PRODUCT_DISCOUNT_RATES[currentProduct.id] || 0;
      }
      amount += applyDiscount({ amount: itemAmount, discountRate });
    })();
  }
  let totalDiscountRate = 0;
  if (itemCount >= DISCOUNT_POLICY.BULK_PURCHASE_THRESHOLD) {
    const bulkDiscount = applyDiscount({
      amount: subTotal,
      discountRate: DISCOUNT_POLICY.BULK_DISCOUNT_RATE,
    });
    const itemDiscount = subTotal - amount;
    if (bulkDiscount > itemDiscount) {
      amount = bulkDiscount;
      totalDiscountRate = DISCOUNT_POLICY.BULK_DISCOUNT_RATE;
    } else {
      totalDiscountRate = (subTotal - amount) / subTotal;
    }
  } else {
    totalDiscountRate = (subTotal - amount) / subTotal;
  }
  if (new Date().getDay() === 2) {
    amount = applyDiscount({
      amount,
      discountRate: DISCOUNT_POLICY.WEEKLY_DISCOUNT_RATES.tuesday,
    });
    totalDiscountRate = Math.max(totalDiscountRate, DISCOUNT_POLICY.WEEKLY_DISCOUNT_RATES.tuesday);
  }
  cartTotal.textContent = '총액: ' + Math.round(amount) + '원';
  if (totalDiscountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (totalDiscountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotal.appendChild(span);
  }
  renderStockStatus();
  renderPoints();
};

const renderPoints = () => {
  points = Math.floor(amount / 1000);

  let pointsElement = document.getElementById('points');

  if (!pointsElement) {
    pointsElement = document.createElement('span');
    pointsElement.id = 'points';
    pointsElement.className = 'text-blue-500 ml-2';
    cartTotal.appendChild(pointsElement);
  }

  pointsElement.textContent = `(포인트: ${points})`;
};

const renderStockStatus = () => {
  getStockStatusElement().innerHTML = products
    .filter((item) => item.quantity < STOCK_POLICY.STOCK_THRESHOLD)
    .map(({ name, quantity }) => {
      const message = `${name}: ${quantity > 0 ? `재고 부족 (${quantity}개 남음)` : '품절'}`;
      return /* html */ `<div class="stock-status-item">${message}</div>`;
    })
    .join('');
};

main();

getAddCartButtonElement().addEventListener('click', () => {
  const selItem = productSelector.value;
  const itemToAdd = products.find((p) => p.id === selItem);
  if (itemToAdd && itemToAdd.quantity > 0) {
    const item = document.getElementById(itemToAdd.id);
    if (item) {
      const newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
      if (newQty <= itemToAdd.quantity) {
        item.querySelector('span').textContent = itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
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
      cartItemContainer.appendChild(newItem);
      itemToAdd.quantity--;
    }
    calcCart();
    lastSelectedProduct = selItem;
  }
});

cartItemContainer.addEventListener('click', (event) => {
  const eventTarget = event.target;
  if (eventTarget.classList.contains('quantity-change') || eventTarget.classList.contains('remove-item')) {
    const productId = eventTarget.dataset.productId;
    const itemElem = document.getElementById(productId);
    const product = products.find((item) => item.id === productId);
    if (eventTarget.classList.contains('quantity-change')) {
      const qtyChange = parseInt(eventTarget.dataset.change);
      const newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + qtyChange;
      if (
        newQty > 0 &&
        newQty <= product.quantity + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
      ) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
        product.quantity -= qtyChange;
      } else if (newQty <= 0) {
        itemElem.remove();
        product.quantity -= qtyChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (eventTarget.classList.contains('remove-item')) {
      const remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
      product.quantity += remQty;
      itemElem.remove();
    }
    calcCart();
  }
});
