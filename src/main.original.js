import {
  BULK_DISCOUNT_RATE,
  DISCOUNT_RATE,
  discountRates,
  POINT_RATE,
  productList,
  SALE_PROBABILITY,
  TUESDAY,
} from './constant/product';

// 전역 변수 선언
var productSelect, addCartButton, cartDisplay, cartTotalPrice, stockStatus;

var lastSelectedProduct,
  bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

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
  if (value) element.value = value;
  if (textContent) element.textContent = textContent;
  if (innerHTML) element.innerHTML = innerHTML;

  return element;
}

function createChildElement(parent, child) {
  const childElement = parent.appendChild(child);
  return childElement;
}

function renderCartUI() {
  var root = document.getElementById('app');
  let contents = createStyledElement({
    tag: 'div',
    className: 'bg-gray-100 p-8',
  });
  var cartSection = createStyledElement({
    tag: 'div',
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
  let headerText = createStyledElement({
    tag: 'h1',
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });

  cartDisplay = createStyledElement({
    tag: 'div',
    id: 'cart-items',
  });
  cartTotalPrice = createStyledElement({
    tag: 'div',
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });
  productSelect = createStyledElement({
    tag: 'select',
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  addCartButton = createStyledElement({
    tag: 'button',
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
  stockStatus = createStyledElement({
    tag: 'div',
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });

  const cartElements = [
    { parent: cartSection, child: headerText },
    { parent: cartSection, child: cartDisplay },
    { parent: cartSection, child: cartTotalPrice },
    { parent: cartSection, child: productSelect },
    { parent: cartSection, child: addCartButton },
    { parent: cartSection, child: stockStatus },
    { parent: contents, child: cartSection },
    { parent: root, child: contents },
  ];

  // 요소 DOM에 추가
  cartElements.forEach(({ parent, child }) =>
    createChildElement(parent, child)
  );
}

// 초기설정 함수
function initializeShoppingCart() {
  renderCartUI();

  calculateCartTotal();
  updateProductOptions();

  startDelayedInterval(handleLuckyItemSale, 30000, 10000);
  startDelayedInterval(handleProductSuggestions, 60000, 20000);
}

// 세일 이벤트 설정
function handleLuckyItemSale() {
  const randomDiscountProduct =
    productList[Math.floor(Math.random() * productList.length)];

  if (Math.random() < SALE_PROBABILITY && randomDiscountProduct.quantity > 0) {
    randomDiscountProduct.price = Math.round(
      randomDiscountProduct.price * DISCOUNT_RATE
    );
    alert(
      '번개세일! ' + randomDiscountProduct.name + '이(가) 20% 할인 중입니다!'
    );
  }
}

// 추천 상품 알림 이벤트 설정
function handleProductSuggestions() {
  if (lastSelectedProduct) {
    const recommendedProduct = productList.find(function (product) {
      return product.id !== lastSelectedProduct && product.quantity > 0;
    });
    if (recommendedProduct) {
      alert(
        recommendedProduct.name +
          '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
      );
      recommendedProduct.price = Math.round(recommendedProduct.price * 0.95);
    }
  }
}

function startDelayedInterval(callback, intervalTime, maxDelay) {
  setTimeout(function () {
    setInterval(function () {
      callback();
    }, intervalTime);
  }, Math.random() * maxDelay);
}

// 상품 선택 옵션 업데이트 함수
function updateProductOptions() {
  productSelect.innerHTML = '';
  productList.forEach(function (product) {
    var productOption = createStyledElement({
      tag: 'option',
      value: product.id,
      textContent: product.name + ' - ' + product.price + '원',
    });

    if (product.quantity === 0) productOption.disabled = true;
    createChildElement(productSelect, productOption);
  });
}

// 대량 구매 할인 적용 하는 함수
function calculateDiscountRate(subTotal) {
  if (itemCount >= 30) {
    var bulkPurchaseDiscount = totalAmount * BULK_DISCOUNT_RATE;
    var itemSpecificDiscount = subTotal - totalAmount;
    if (bulkPurchaseDiscount > itemSpecificDiscount) {
      totalAmount = subTotal * (1 - BULK_DISCOUNT_RATE);
      return BULK_DISCOUNT_RATE;
    } else {
      return (subTotal - totalAmount) / subTotal;
    }
  } else {
    return (subTotal - totalAmount) / subTotal;
  }
}

// 화요일 추가 할인 적용하는 함수
function applyWeeklyDiscount(totalAmount, totalDiscountRate) {
  if (new Date().getDay() === TUESDAY) {
    totalAmount *= 1 - 0.1;
    totalDiscountRate = Math.max(totalDiscountRate, 0.1);
  }
  return { totalAmount, totalDiscountRate };
}

// 장바구니 총액 계산 함수
function calculateCartTotal() {
  totalAmount = 0;
  itemCount = 0;

  var cartItems = cartDisplay.children;
  var subTotal = 0;

  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var currentProduct;
      for (var j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          currentProduct = productList[j];
          break;
        }
      }

      var cartItemQuantity = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1]
      );
      var itemTotal = currentProduct.price * cartItemQuantity;
      var discountRate = 0;
      itemCount += cartItemQuantity;
      subTotal += itemTotal;

      if (cartItemQuantity >= 10) {
        discountRate = discountRates[currentProduct.id];
      }

      totalAmount += itemTotal * (1 - discountRate);
    })();
  }

  //전체 할인율
  let totalDiscountRate = 0;

  totalDiscountRate = calculateDiscountRate(subTotal);

  const { totalAmount: finalAmount, totalDiscountRate: finalDiscountRate } =
    applyWeeklyDiscount(totalAmount, totalDiscountRate);

  // 총액 표시
  cartTotalPrice.textContent = '총액: ' + Math.round(finalAmount) + '원';

  if (finalDiscountRate > 0) {
    var span = createStyledElement({
      tag: 'span',
      className: 'text-green-500 ml-2',
      textContent: '(' + (finalDiscountRate * 100).toFixed(1) + '% 할인 적용)',
    });

    createChildElement(cartTotalPrice, span);
  }

  updateStockStatus();
  renderBonusPoints();
}

// 보너스 포인트 렌더 함수
const renderBonusPoints = () => {
  bonusPoints = Math.floor(totalAmount / POINT_RATE);

  var loyaltyPointsElement = document.getElementById('loyalty-points');

  if (!loyaltyPointsElement) {
    loyaltyPointsElement = createStyledElement({
      tag: 'span',
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
    });
    createChildElement(cartTotalPrice, loyaltyPointsElement);
  }

  loyaltyPointsElement.textContent = '(포인트: ' + bonusPoints + ')';
};

// 재고 상태 업데이트 함수
function updateStockStatus() {
  var stockStatusMessage = '';

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

  stockStatus.textContent = stockStatusMessage;
}

initializeShoppingCart();

// 장바구니에 제품을 추가하는 함수
function addCartProduct(product) {
  const existingItem = document.getElementById(product.id);

  if (existingItem) {
    updateCartProductQuantity(existingItem, product);
  } else {
    addNewCartProduct(product);
  }

  calculateCartTotal();
}

// 장바구니에 있는 제품의 수량을 업데이트하는 함수
function updateCartProductQuantity(existingItem, product) {
  const quantityElement = existingItem.querySelector('span');
  const newQuantity = parseInt(quantityElement.textContent.split('x ')[1]) + 1;

  if (newQuantity <= product.quantity) {
    quantityElement.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.quantity--;
  } else {
    alert('재고가 부족합니다.');
  }
}

// 장바구니에 새로운 제품을 추가하는 함수
function addNewCartProduct(product) {
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

  createChildElement(cartDisplay, newItem);
  product.quantity--;
}

// 상품 선택 후 장바구니에 추가하는 이벤트 처리 함수
function handleAddCartProduct() {
  const selectedProductId = productSelect.value;
  const addProduct = productList.find(
    (product) => product.id === selectedProductId
  );

  if (addProduct && addProduct.quantity > 0) {
    addCartProduct(addProduct);
    calculateCartTotal();
    lastSelectedProduct = selectedProductId;
  }
}

// 장바구니에서 제품 수량을 변경하거나 삭제하는 함수
function handleAddProductQuantity(event) {
  var clickedElement = event.target;

  var productId = clickedElement.dataset.productId;
  var cartItemElement = document.getElementById(productId);
  var product = productList.find(function (product) {
    return product.id === productId;
  });

  if (clickedElement.classList.contains('quantity-change')) {
    updateProductQuantity(clickedElement, cartItemElement, product);
  } else if (clickedElement.classList.contains('remove-item')) {
    removeProductFromCart(cartItemElement, product);
  }

  calculateCartTotal();
}

// 장바구니에서 제품을 삭제하는 함수
function removeProductFromCart(cartItemElement, product) {
  var removedQuantity = parseInt(
    cartItemElement.querySelector('span').textContent.split('x ')[1]
  );
  product.quantity += removedQuantity;
  cartItemElement.remove();
}

// 장바구니에 있는 제품의 수량을 업데이트하는 함수
function updateProductQuantity(clickedElement, cartItemElement, product) {
  var quantityChange = parseInt(clickedElement.dataset.change);
  var newQuantity =
    parseInt(cartItemElement.querySelector('span').textContent.split('x ')[1]) +
    quantityChange;

  if (
    newQuantity > 0 &&
    newQuantity <=
      product.quantity +
        parseInt(
          cartItemElement.querySelector('span').textContent.split('x ')[1]
        )
  ) {
    cartItemElement.querySelector('span').textContent =
      cartItemElement.querySelector('span').textContent.split('x ')[0] +
      'x ' +
      newQuantity;
    product.quantity -= quantityChange;
  } else if (newQuantity <= 0) {
    removeProductFromCart(clickedElement);
    product.quantity -= quantityChange;
  } else {
    alert('재고가 부족합니다.');
  }
}

// 추가 버튼 클릭 이벤트 핸들러
addCartButton.addEventListener('click', handleAddCartProduct);

cartDisplay.addEventListener('click', handleAddProductQuantity);
