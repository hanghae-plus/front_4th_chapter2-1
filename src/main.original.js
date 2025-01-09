import {
  BULK_DISCOUNT_RATE,
  discountRates,
  POINT_RATE,
  productList,
  SALE_PROBABILITY,
  TUESDAY,
} from './constant/product';

function startDelayedInterval(callback, intervalTime, maxDelay) {
  setTimeout(function () {
    setInterval(function () {
      callback();
    }, intervalTime);
  }, Math.random() * maxDelay);
}

function initializeShoppingCart() {
  const cart = {
    productSelect: null,
    addCartButton: null,
    cartDisplay: null,
    cartTotalPrice: null,
    stockStatus: null,
    lastSelectedProduct: null,
    bonusPoints: 0,
    totalAmount: 0,
    itemCount: 0,
  };

  renderCartUI(cart);
  updateProductOptions(cart);
  calculateCartTotal(cart);
  startDelayedInterval(() => handleLuckyItemSale(cart), 30000, 10000);
  startDelayedInterval(() => handleProductSuggestions(cart), 60000, 20000);

  setupEventListeners(cart);
}

function createStyledElement({
  tag,
  id,
  className,
  textContent,
  value,
  innerHTML,
}) {
  const element = document.createElement(tag);

  if (id) element.id = id;
  if (className) element.className = className;
  if (tag === 'option' && value) {
    element.value = value;
  }
  if (textContent) element.textContent = textContent;
  if (innerHTML) element.innerHTML = innerHTML;

  return element;
}

function createChildElement(parent, child) {
  const childElement = parent.appendChild(child);
  return childElement;
}

// UI 렌더링 함수
function renderCartUI(cart) {
  let root = document.getElementById('app');
  let contents = createStyledElement({
    tag: 'div',
    className: 'bg-gray-100 p-8',
  });
  let cartSection = createStyledElement({
    tag: 'div',
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
  let headerText = createStyledElement({
    tag: 'h1',
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });

  cart.cartDisplay = createStyledElement({
    tag: 'div',
    id: 'cart-items',
  });
  cart.cartTotalPrice = createStyledElement({
    tag: 'div',
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });
  cart.productSelect = createStyledElement({
    tag: 'select',
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  cart.addCartButton = createStyledElement({
    tag: 'button',
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
  cart.stockStatus = createStyledElement({
    tag: 'div',
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });

  const cartElements = [
    { parent: cartSection, child: headerText },
    { parent: cartSection, child: cart.cartDisplay },
    { parent: cartSection, child: cart.cartTotalPrice },
    { parent: cartSection, child: cart.productSelect },
    { parent: cartSection, child: cart.addCartButton },
    { parent: cartSection, child: cart.stockStatus },
    { parent: contents, child: cartSection },
    { parent: root, child: contents },
  ];

  cartElements.forEach(({ parent, child }) =>
    createChildElement(parent, child)
  );
}

// 상품 선택 옵션 업데이트 함수
function updateProductOptions(cart) {
  cart.productSelect.innerHTML = '';
  productList.forEach(function (product) {
    let productOption = createStyledElement({
      tag: 'option',
      value: product.id,
      textContent: product.name + ' - ' + product.price + '원',
    });

    if (product.quantity === 0) productOption.disabled = true;
    createChildElement(cart.productSelect, productOption);
  });
}

// 장바구니 총액 계산 함수
function calculateCartTotal(cart) {
  cart.totalAmount = 0;
  cart.itemCount = 0;

  let cartItems = Array.from(cart.cartDisplay.children);
  let subTotal = 0;

  cartItems.forEach((item) => {
    const currentProduct = productList.find(
      (product) => product.id === item.id
    );
    const cartItemQuantity = parseInt(
      item.querySelector('span').textContent.split('x ')[1]
    );

    const itemTotal = currentProduct.price * cartItemQuantity;
    let discountRate = 0;
    cart.itemCount += cartItemQuantity;
    subTotal += itemTotal;

    if (cartItemQuantity >= 10) {
      discountRate = discountRates[currentProduct.id];
    }

    cart.totalAmount += itemTotal * (1 - discountRate);
  });

  let totalDiscountRate = calculateDiscountRate(subTotal, cart);

  const { totalAmount: finalAmount, totalDiscountRate: finalDiscountRate } =
    applyWeeklyDiscount(cart.totalAmount, totalDiscountRate);

  cart.cartTotalPrice.textContent = '총액: ' + Math.round(finalAmount) + '원';

  if (finalDiscountRate > 0) {
    let span = createStyledElement({
      tag: 'span',
      className: 'text-green-500 ml-2',
      textContent: '(' + (finalDiscountRate * 100).toFixed(1) + '% 할인 적용)',
    });

    createChildElement(cart.cartTotalPrice, span);
  }

  updateStockStatus(cart);
  renderBonusPoints(cart);
}

// 대량 구매 할인 적용 함수
function calculateDiscountRate(subTotal, cart) {
  if (cart.itemCount >= 30) {
    let bulkPurchaseDiscount = cart.totalAmount * BULK_DISCOUNT_RATE;
    let itemSpecificDiscount = subTotal - cart.totalAmount;
    if (bulkPurchaseDiscount > itemSpecificDiscount) {
      cart.totalAmount = subTotal * (1 - BULK_DISCOUNT_RATE);
      return BULK_DISCOUNT_RATE;
    }
    return (subTotal - cart.totalAmount) / subTotal;
  }
  return (subTotal - cart.totalAmount) / subTotal;
}

// 화요일 추가 할인 적용 함수
function applyWeeklyDiscount(cartAmount, totalDiscountRate) {
  if (new Date().getDay() === TUESDAY) {
    cartAmount *= 1 - 0.1;
    totalDiscountRate = Math.max(totalDiscountRate, 0.1);
  }
  return { totalAmount: cartAmount, totalDiscountRate };
}

// 보너스 포인트 렌더 함수
function renderBonusPoints(cart) {
  cart.bonusPoints = Math.floor(cart.totalAmount / POINT_RATE);
  let loyaltyPointsElement = document.getElementById('loyalty-points');

  if (!loyaltyPointsElement) {
    loyaltyPointsElement = createStyledElement({
      tag: 'span',
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
    });
    createChildElement(cart.cartTotalPrice, loyaltyPointsElement);
  }

  loyaltyPointsElement.textContent = '(포인트: ' + cart.bonusPoints + ')';
}

// 재고 상태 업데이트 함수
function updateStockStatus(cart) {
  let stockStatusMessage = '';

  productList.forEach(function (product) {
    if (product.quantity < 5) {
      stockStatusMessage +=
        product.name +
        ': ' +
        (product.quantity > 0
          ? '재고 부족 (' + product.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });

  cart.stockStatus.textContent = stockStatusMessage;
}

// 장바구니에 제품을 추가하는 함수
function addCartProduct(cart, product) {
  const existingItem = document.getElementById(product.id);

  if (existingItem) {
    updateCartProductQuantity(existingItem, cart, product);
  } else {
    addNewCartProduct(cart, product);
  }
  calculateCartTotal(cart);
}

// 장바구니에 있는 제품의 수량을 업데이트하는 함수
function updateCartProductQuantity(existingItem, cart, product) {
  const quantityElement = existingItem.querySelector('span');
  const newQuantity = parseInt(quantityElement.textContent.split('x ')[1]) + 1;

  if (newQuantity <= product.quantity) {
    quantityElement.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.quantity--;
    return;
  }

  alert('재고가 부족합니다.');
}

// 장바구니에 새로운 제품을 추가하는 함수
function addNewCartProduct(cart, product) {
  const newItem = createStyledElement({
    tag: 'div',
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
  createChildElement(cart.cartDisplay, newItem);
  product.quantity--;
}

// 상품 선택 후 장바구니에 추가하는 이벤트 처리 함수
function handleAddCartProduct(cart) {
  const selectedProductId = cart.productSelect.value;
  const addProduct = productList.find(
    (product) => product.id === selectedProductId
  );

  if (addProduct && addProduct.quantity > 0) {
    addCartProduct(cart, addProduct);
    calculateCartTotal(cart);
  } else {
    alert('재고가 부족합니다.');
  }
}

function updateCartTotal(cart) {
  const totalAmount = cart.totalAmount;
  const bonusPoints = cart.bonusPoints;
  cart.cartTotalPrice.textContent = `Total: ${totalAmount}원 (Bonus: ${bonusPoints} Points)`;
}

// 행운 상품 처리 함수
function handleLuckyItemSale(cart) {
  const luckyProduct = productList.find(
    (product) => product.saleChance > Math.random()
  );
  if (luckyProduct) {
    alert(`${luckyProduct.name}이(가) 행운 상품으로 할인되었습니다!`);
    luckyProduct.salePrice = luckyProduct.price * (1 - SALE_PROBABILITY);
    updateCartTotal(cart);
  }
}

// 추천 상품 처리 함수
function handleProductSuggestions() {
  let suggestedProduct =
    productList[Math.floor(Math.random() * productList.length)];
  alert(`${suggestedProduct.name}을 추천합니다!`);
}

// 이벤트 등록 함수
function setupEventListeners(cart) {
  cart.addCartButton.addEventListener('click', function () {
    handleAddCartProduct(cart);
  });

  cart.cartDisplay.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-item')) {
      const productId = event.target.dataset.productId;
      const productIndex = cart.cartDisplay.querySelector(`#${productId}`);
      cart.cartDisplay.removeChild(productIndex);
      productList.forEach((product) => {
        if (product.id === productId) product.quantity++;
      });
      calculateCartTotal(cart);
    }

    if (event.target.classList.contains('quantity-change')) {
      const productId = event.target.dataset.productId;
      const change = parseInt(event.target.dataset.change);
      const product = productList.find((product) => product.id === productId);
      const productIndex = cart.cartDisplay.querySelector(`#${productId}`);
      const quantityElement = productIndex.querySelector('span');
      const quantity = parseInt(quantityElement.textContent.split('x ')[1]);

      if (
        quantity + change <=
        product.quantity + parseInt(quantityElement.textContent.split('x ')[1])
      ) {
        quantityElement.textContent = `${product.name} - ${product.price}원 x ${quantity + change}`;
        product.quantity -= change;
        calculateCartTotal(cart);
      } else {
        alert('재고가 부족합니다.');
      }
    }
  });
}

initializeShoppingCart();
