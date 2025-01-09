// 상수 정의
const DISCOUNTS = {
  BULK: 0.25,
  TUESDAY: 0.1,
  PRODUCT: {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  },
};

const LIGHTNING_SALE_PROB = 0.3;
const LIGHTNING_SALE_DISCOUNT = 0.2;
const SUGGESTION_DISCOUNT = 0.05;
const POINT_CONVERSION = 1000;

// 상태 변수
let productList = [],
  lastSelected = null,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

const elements = {};

const main = () => {
  initProductList();
  initDOMElements();
  renderUI();
  initializeEventListeners();
  applyDynamicSales();
};

const initProductList = () => {
  productList = [
    { id: 'p1', name: '상품1', price: 10000, stock: 50 },
    { id: 'p2', name: '상품2', price: 20000, stock: 30 },
    { id: 'p3', name: '상품3', price: 30000, stock: 20 },
    { id: 'p4', name: '상품4', price: 15000, stock: 0 },
    { id: 'p5', name: '상품5', price: 25000, stock: 10 },
  ];
};

const initDOMElements = () => {
  elements.root = document.getElementById('app');
  elements.container = createElement('div', { className: 'bg-gray-100 p-8' });
  elements.wrapper = createElement('div', {
    className: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
  elements.title = createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });
  elements.cartItems = createElement('div', { id: 'cart-items' });
  elements.total = createElement('div', { id: 'cart-total', className: 'text-xl font-bold my-4' });
  elements.productSelect = createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  elements.addToCartButton = createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
  elements.stockStatus = createElement('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });
};

const renderUI = () => {
  updateProductOptions();
  elements.wrapper.append(
    elements.title,
    elements.cartItems,
    elements.total,
    elements.productSelect,
    elements.addToCartButton,
    elements.stockStatus
  );
  elements.container.appendChild(elements.wrapper);
  elements.root.appendChild(elements.container);
  calculateCart();
};

const initializeEventListeners = () => {
  elements.addToCartButton.addEventListener('click', addToCart);
  elements.cartItems.addEventListener('click', handleCartActions);
};

const updateProductOptions = () => {
  elements.productSelect.innerHTML = '';
  productList.forEach(({ id, name, price, stock }) => {
    const option = createElement('option', {
      value: id,
      textContent: `${name} - ${price}원`,
      disabled: stock === 0,
    });
    elements.productSelect.appendChild(option);
  });
};

const calculateCart = () => {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = Array.from(elements.cartItems.children);
  let subTotal = 0;
  let maxDiscountRate = 0;

  elements.total.textContent = '';

  cartItems.forEach((item) => {
    const productId = item.id;
    const quantity = parseInt(item.querySelector('span').textContent.split('x ')[1]);
    const product = productList.find((p) => p.id === productId);

    const itemTotal = product.price * quantity;
    let discount = 0;

    if (quantity >= 10) {
      discount = DISCOUNTS.PRODUCT[productId] || 0;
      totalAmount += itemTotal * (1 - discount);
    } else {
      totalAmount += itemTotal;
    }

    maxDiscountRate = Math.max(maxDiscountRate, discount);
    itemCount += quantity;
    subTotal += itemTotal;
  });

  applyBulkAndSpecialDiscounts(subTotal, maxDiscountRate);
  updateCartSummary(subTotal);
};

const applyBulkAndSpecialDiscounts = (subTotal, maxDiscountRate) => {
  let discountRate = maxDiscountRate;

  if (itemCount >= 30) {
    const bulkDiscount = subTotal * DISCOUNTS.BULK;
    const itemDiscount = subTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = subTotal * (1 - DISCOUNTS.BULK);
      discountRate = DISCOUNTS.BULK;
    } else {
      discountRate = itemDiscount / subTotal;
    }
  }

  if (new Date().getDay() === 2) {
    totalAmount *= 1 - DISCOUNTS.TUESDAY;
    discountRate = Math.max(discountRate, DISCOUNTS.TUESDAY);
  }

  elements.total.textContent = `총액: ${Math.round(totalAmount)}원`;
  if (discountRate > 0) {
    const discountInfo = createElement('span', {
      className: 'text-green-500 ml-2',
      textContent: `(${(discountRate * 100).toFixed(1)}% 할인 적용)`,
    });
    elements.total.appendChild(discountInfo);
  }
  updateStockInfo();
  updateBonusPoints();
};

const updateCartSummary = (subTotal) => {
  const summaryText = `총 ${itemCount}개 상품, 소계: ${Math.round(subTotal)}원`;
  const summaryElement = createElement('div', {
    id: 'cart-summary',
    className: 'text-sm text-gray-500',
    textContent: summaryText,
  });

  const existingSummary = document.getElementById('cart-summary');
  if (existingSummary) {
    existingSummary.replaceWith(summaryElement);
  } else {
    elements.total.insertAdjacentElement('afterend', summaryElement);
  }
};

const updateBonusPoints = () => {
  bonusPoints = Math.floor(totalAmount / POINT_CONVERSION);
  let pointsTag = document.getElementById('loyalty-points');

  if (!pointsTag) {
    pointsTag = createElement('span', {
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
    });
    elements.total.appendChild(pointsTag);
  }

  pointsTag.textContent = `(포인트: ${bonusPoints})`;
};

const updateStockInfo = () => {
  const infoMessages = productList
    .filter(({ stock }) => stock < 5)
    .map(({ name, stock }) => `${name}: ${stock > 0 ? `재고 부족 (${stock}개 남음)` : '품절'}`);

  elements.stockStatus.textContent = infoMessages.join('\n');
};

const addToCart = () => {
  const selectedId = elements.productSelect.value;
  const selectedProduct = productList.find((p) => p.id === selectedId);

  if (selectedProduct && selectedProduct.stock > 0) {
    const existingItem = document.getElementById(selectedId);

    if (existingItem) {
      const quantity = parseInt(existingItem.querySelector('span').textContent.split('x ')[1]) + 1;

      if (quantity <= selectedProduct.stock) {
        updateCartItem(existingItem, selectedProduct, quantity);
        selectedProduct.stock--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      createCartItem(selectedProduct);
      selectedProduct.stock--;
    }

    calculateCart();
    lastSelected = selectedId;
  }
};

const handleCartActions = (event) => {
  const target = event.target;
  const productId = target.dataset.productId;
  const product = productList.find((p) => p.id === productId);
  const itemElement = document.getElementById(productId);

  if (target.classList.contains('quantity-change')) {
    const quantityChange = parseInt(target.dataset.change);
    const currentQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
    const newQuantity = currentQuantity + quantityChange;

    if (newQuantity > 0 && newQuantity <= product.stock + currentQuantity) {
      updateCartItem(itemElement, product, newQuantity);
      product.stock -= quantityChange;
    } else if (newQuantity <= 0) {
      itemElement.remove();
      product.stock -= quantityChange;
    } else {
      alert('재고가 부족합니다.');
    }
  } else if (target.classList.contains('remove-item')) {
    const quantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
    product.stock += quantity;
    itemElement.remove();
  }

  calculateCart();
};

const createCartItem = (product) => {
  const itemElement = createElement('div', {
    id: product.id,
    className: 'flex justify-between items-center mb-2',
    innerHTML: `
      <span>${product.name} - ${product.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
      </div>
    `,
  });

  elements.cartItems.appendChild(itemElement);
};

const updateCartItem = (itemElement, product, quantity) => {
  itemElement.querySelector('span').textContent =
    `${product.name} - ${product.price}원 x ${quantity}`;
};

const applyDynamicSales = () => {
  setInterval(() => {
    if (Math.random() < LIGHTNING_SALE_PROB) {
      const saleProduct = productList.find((p) => p.stock > 0);

      if (saleProduct) {
        saleProduct.price = Math.round(saleProduct.price * (1 - LIGHTNING_SALE_DISCOUNT));
        alert(
          `번개세일! ${saleProduct.name}이(가) ${LIGHTNING_SALE_DISCOUNT * 100}% 할인 중입니다!`
        );
        updateProductOptions();
      }
    }
  }, 30000);

  setInterval(() => {
    if (lastSelected) {
      const suggestion = productList.find((p) => p.id !== lastSelected && p.stock > 0);

      if (suggestion) {
        suggestion.price = Math.round(suggestion.price * (1 - SUGGESTION_DISCOUNT));
        alert(
          `${suggestion.name}은(는) 어떠세요? 지금 구매하시면 ${SUGGESTION_DISCOUNT * 100}% 추가 할인!`
        );
        updateProductOptions();
      }
    }
  }, 60000);
};

const createElement = (tag, options = {}) => {
  const element = document.createElement(tag);
  Object.assign(element, options);
  return element;
};

main();
