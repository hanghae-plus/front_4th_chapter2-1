const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;
const ITEM_DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};
const LIGHTNING_SALE_RATE = 0.2;
const ALTERNATE_ITEM_DISCOUNT_RATE = 0.05;

let productList = [];
let cart = {};
let bonusPoints = 0;
let totalAmount = 0;
let totalItems = 0;
let lastSelectedItem = null;
let dom = {};

function main() {
  initializeProductList();
  initializeDOMElements();
  renderAppStructure();
  updateProductOptions();
  setupEventListeners();
  calculateCart();
  startDiscountTimers();
}

function initializeProductList() {
  productList = [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ];
  cart = {};
}


function initializeDOMElements() {
  dom = {
    root: document.getElementById("app"),
    container: createElement("div", { class: "bg-gray-100 p-8" }),
    cartDisplay: createElement("div", { id: "cart-items" }),
    totalDisplay: createElement("div", {
      id: "cart-total",
      class: "text-xl font-bold my-4",
    }),
    stockInfo: createElement("div", {
      id: "stock-status",
      class: "text-sm text-gray-500 mt-2",
    }),
    productSelect: createElement("select", {
      id: "product-select",
      class: "border rounded p-2 mr-2",
    }),
    addButton: createElement("button", {
      id: "add-to-cart",
      class: "bg-blue-500 text-white px-4 py-2 rounded",
      text: "추가",
    }),
  };
}



function renderAppStructure() {
  const { root, container, cartDisplay, totalDisplay, productSelect, addButton, stockInfo } = dom;

  const title = createElement("h1", {
    class: "text-2xl font-bold mb-4",
    text: "장바구니",
  });
  const wrapper = createElement("div", {
    class: "max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8",
  });

  appendChildren(wrapper, [
    title,
    cartDisplay,
    totalDisplay,
    productSelect,
    addButton,
    stockInfo,
  ]);
  container.appendChild(wrapper);
  root.appendChild(container);
}

function updateProductOptions() {
  const { productSelect } = dom;
  productSelect.innerHTML = "";
  productList.forEach((product) => {
    const option = createElement("option", {
      value: product.id,
      text: `${product.name} - ${product.price}원`,
      disabled: product.stock === 0,
    });
    productSelect.appendChild(option);
  });
}

function calculateCart() {
  const { cartDisplay } = dom;
  totalAmount = 0;
  totalItems = 0;
  let subTotal = 0;

  Array.from(cartDisplay.children).forEach((cartItem) => {
    const itemId = cartItem.id;
    const product = productList.find((p) => p.id === itemId);
    const quantity = parseInt(
      cartItem.querySelector("span").textContent.split("x ")[1]
    );
    const itemTotal = product.price * quantity;
    const discountedTotal = applyItemDiscount(product.id, quantity, itemTotal);

    totalItems += quantity;
    subTotal += itemTotal;
    totalAmount += discountedTotal;
  });

  const discountRate = calculateTotalDiscountRate(subTotal);
  updateTotalDisplay(discountRate);
  updateStockInfo();
  renderBonusPoints();
}


function calculateTotalDiscountRate(subTotal) {
  let discountRate = 0;
  if (totalItems >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = subTotal * BULK_DISCOUNT_RATE;
    const itemDiscount = subTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    } else {
      discountRate = itemDiscount / subTotal;
    }
  } else {
    discountRate = (subTotal - totalAmount) / subTotal;
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - TUESDAY_DISCOUNT_RATE;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  }
  return discountRate;
}

function applyItemDiscount(productId, quantity, itemTotal) {
  const discountRate =
    quantity >= 10 ? ITEM_DISCOUNT_RATES[productId] || 0 : 0;
  return itemTotal * (1 - discountRate);
}

function updateTotalDisplay(discountRate) {
  const { totalDisplay } = dom;
  totalDisplay.textContent = `총액: ${Math.round(totalAmount)}원`;

  if (discountRate > 0) {
    const discountSpan = createElement("span", {
      class: "text-green-500 ml-2",
      text: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`
    });
    totalDisplay.appendChild(discountSpan);
  }
}

function renderBonusPoints() {
const { totalDisplay } = dom;
  bonusPoints = Math.floor(totalAmount / 1000);
  const pointsDisplay = document.getElementById('loyalty-points') ||
    createElement('span', { id: 'loyalty-points', class: 'text-blue-500 ml-2' });

  pointsDisplay.textContent = `(포인트: ${bonusPoints})`;
  totalDisplay.appendChild(pointsDisplay);
}

function updateStockInfo() {
const { stockInfo } = dom;
  stockInfo.textContent = productList
    .filter(product => product.stock < 5)
    .map(product => `${product.name}: ${product.stock > 0 ? `재고 부족 (${product.stock})` : '품절'}`)
    .join('\n');
}

function setupEventListeners() {
  const { addButton, cartDisplay } = dom;
  addButton.addEventListener('click', handleAddToCart);
  cartDisplay.addEventListener('click', handleCartActions);
}

function handleAddToCart() {
  const { productSelect, cartDisplay } = dom;
  const selectedProductId = productSelect.value;
  const selectedProduct = productList.find(product => product.id === selectedProductId);

  if (!selectedProduct || selectedProduct.stock === 0) return;

  const existingItem = document.getElementById(selectedProductId);
  if (existingItem) {
    const currentQty = parseInt(existingItem.querySelector('span').textContent.split('x ')[1]);
    const newQty = currentQty + 1;
    
    if (newQty <= selectedProduct.stock + currentQty) {
      existingItem.querySelector('span').textContent = 
        `${selectedProduct.name} - ${selectedProduct.price}원 x ${newQty}`;
      selectedProduct.stock--;
    } else {
      alert('재고가 부족합니다.');
    }
  } else {
    const newItem = renderCartItem(selectedProduct, 1);
    cartDisplay.appendChild(newItem);
    selectedProduct.stock--;
  }

  calculateCart();
  lastSelectedItem = selectedProductId;
}

function handleCartActions(event) {
  const target = event.target;
  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) return;

  const productId = target.dataset.productId;
  const itemElement = document.getElementById(productId);
  const product = productList.find(p => p.id === productId);

  if (target.classList.contains('quantity-change')) {
    const quantityChange = parseInt(target.dataset.change);
    const currentQty = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
    const newQty = currentQty + quantityChange;

    if (newQty > 0 && newQty <= product.stock + currentQty) {
      itemElement.querySelector('span').textContent = 
        `${product.name} - ${product.price}원 x ${newQty}`;
      product.stock -= quantityChange;
    } else if (newQty <= 0) {
      itemElement.remove();
      product.stock -= quantityChange;
    } else {
      alert('재고가 부족합니다.');
    }
  } else if (target.classList.contains('remove-item')) {
    const removeQty = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
    product.stock += removeQty;
    itemElement.remove();
  }

  calculateCart();
}

function renderCartItem(product, quantity) {
  return createElement('div', {
    id: product.id,
    class: 'flex justify-between items-center mb-2',
    html: `
      <span>${product.name} - ${product.price}원 x ${quantity}</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
      </div>
    `
  });
}

function startDiscountTimers() {
  setTimeout(() => {
    setInterval(() => {
      const luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.stock > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
        updateProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      if (lastSelectedItem) {
        const suggestion = productList.find(item => 
          item.id !== lastSelectedItem && item.stock > 0
        );
        if (suggestion) {
          alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
          suggestion.price = Math.round(suggestion.price * 0.95);
          updateProductOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

function suggestSaleItem() {
  const eligibleItems = productList.filter(item => item.stock > 0);
  if (eligibleItems.length === 0) return;

  const luckyItem = eligibleItems[Math.floor(Math.random() * eligibleItems.length)];
  luckyItem.price = Math.round(luckyItem.price * 0.8);
  alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
  updateProductOptions();
}

function suggestAlternateItem() {
  if (!lastSelectedItem) return;
  const suggestion = productList.find(item => item.id !== lastSelectedItem && item.stock > 0);

  if (suggestion) {
    suggestion.price = Math.round(suggestion.price * 0.95);
    alert(`${suggestion.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
    updateProductOptions();
  }
}

function createElement(tag, { id, class: className, text, html, value, disabled } = {}) {
  const element = document.createElement(tag);
  if (id) element.id = id;
  if (className) element.className = className;
  if (text) element.textContent = text;
  if (html) element.innerHTML = html;
  if (value) element.value = value;
  if (disabled) element.disabled = disabled;
  return element;
}

function appendChildren(parent, children) {
  children.forEach(child => parent.appendChild(child));
}

main();