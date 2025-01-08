let products, productSelect, addProductButton, cartContainer, cartTotalDisplay, stockInfo;
let lastSelect,
  bonusPoints = 0,
  cartTotal = 0,
  itemCnt = 0;

function main() {
  products = [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ];

  const section = document.createElement('div');
  section.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold mb-4';
  title.textContent = '장바구니';
  section.appendChild(title);

  cartContainer = document.createElement('div');
  cartContainer.id = 'cart-items';
  section.appendChild(cartContainer);

  cartTotalDisplay = document.createElement('div');
  cartTotalDisplay.id = 'cart-total';
  cartTotalDisplay.className = 'text-xl font-bold my-4';
  section.appendChild(cartTotalDisplay);

  productSelect = document.createElement('select');
  productSelect.id = 'product-select';
  productSelect.className = 'border rounded p-2 mr-2';
  section.appendChild(productSelect);

  addProductButton = document.createElement('button');
  addProductButton.id = 'add-to-cart';
  addProductButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  addProductButton.textContent = '추가';
  section.appendChild(addProductButton);

  stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-sm text-gray-500 mt-2';
  section.appendChild(stockInfo);

  const container = document.createElement('div');
  container.className = 'bg-gray-100 p-8';
  container.appendChild(section);

  const $root = document.getElementById('app');
  $root.appendChild(container);

  updateProductPrice();

  calcCart();

  setTimeout(() => {
    setInterval(() => {
      luckyDiscountAlert();
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      recommendDiscountAlert();
    }, 60000);
  }, Math.random() * 20000);
}

// 상품 목록 중 랜덤으로 하나를 선택하여 20% 할인
function luckyDiscountAlert() {
  const luckyItem = products[Math.floor(Math.random() * products.length)];
  if (Math.random() < 0.8 && luckyItem.quantity > 0) {
    luckyItem.price = Math.round(luckyItem.price * 0.3);
    alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
    updateProductPrice();
  }
}

// 마지막 선택한 상품을 기준으로 추천 상품을 5% 할인
function recommendDiscountAlert() {
  if (lastSelect) {
    const recommendedProduct = products.find(product => {
      return product.id !== lastSelect && product.quantity > 0;
    });

    if (recommendedProduct) {
      alert(recommendedProduct.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
      recommendedProduct.price = Math.round(recommendedProduct.price * 0.95);
      updateProductPrice();
    }
  }
}

// 상품 목록 option에서 할인된 가격으로 업데이트
function updateProductPrice() {
  productSelect.innerHTML = '';
  products.forEach(product => {
    const updateOption = document.createElement('option');
    updateOption.value = product.id;
    updateOption.textContent = product.name + ' - ' + product.price + '원';
    if (product.quantity === 0) updateOption.disabled = true;
    productSelect.appendChild(updateOption);
  });
}

// 장바구니 총액 계산
function calcCart() {
  cartTotal = 0; // 할인 적용된 가격
  itemCnt = 0; // 장바구니에 담긴 상품 수량
  let originalTotal = 0;

  // 장바구니에 담긴 상품들의 총액 계산
  ({ cartTotal, itemCnt, originalTotal } = calcCartTotal({ cartTotal, itemCnt, originalTotal }));

  let discountRate = (originalTotal - cartTotal) / originalTotal;
  // 30개 이상 구매시 대량 구매 할인 적용
  ({ cartTotal, itemCnt, originalTotal, discountRate } = calcBulkDiscount({ cartTotal, itemCnt, originalTotal, discountRate }));

  // 화요일에는 10% 할인
  if (new Date().getDay() === 2) {
    ({ cartTotal, discountRate } = calcTuesdayDiscount(cartTotal, discountRate));
  }

  // 총액 및 할인 적용 표시
  ({ cartTotal, discountRate } = renderCartTotal(cartTotal, discountRate));

  updateStockInfo();
  renderBonusPoints();
}

const TUESDAY_DISCOUNT_RATE = 0.1;
const calcTuesdayDiscount = (cartTotal, discountRate) => {
  cartTotal *= 1 - TUESDAY_DISCOUNT_RATE;
  discountRate = Math.max(discountRate, TUESDAY_DISCOUNT_RATE);
  return { cartTotal, discountRate };
};

const ITEM_BY_DISCOUNT_RATE = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};
const calcCartTotal = ({ cartTotal, itemCnt, originalTotal }) => {
  const cartItems = cartContainer.children;
  Array.from(cartItems).forEach(item => {
    let currentItem = products.find(product => product.id === item.id);
    const currentItemQuantity = parseInt(item.querySelector('span').textContent.split('x ')[1]);
    const currentItemTotal = currentItem.price * currentItemQuantity;
    itemCnt += currentItemQuantity;
    originalTotal += currentItemTotal; // 할인 적용 전 총액

    // 10개 이상 구매시 할인율 적용
    let discountRate = 0;
    if (currentItemQuantity >= 10) {
      discountRate = ITEM_BY_DISCOUNT_RATE[currentItem.id];
    }

    cartTotal += currentItemTotal * (1 - discountRate);
  });

  return { cartTotal, itemCnt, originalTotal };
};

const BULK_DISCOUNT_RATE = 0.25;
const calcBulkDiscount = ({ cartTotal, itemCnt, originalTotal, discountRate }) => {
  if (itemCnt >= 30) {
    let bulkDiscount = cartTotal * BULK_DISCOUNT_RATE; // 대량 구매 할인 총액
    let itemDiscount = originalTotal - cartTotal; // 아이템 할인 총액

    // 대량 구매 할인 총액이 아이템 할인 총액보다 클 경우, 대량 구매 할인 적용
    if (bulkDiscount > itemDiscount) {
      cartTotal = originalTotal * (1 - BULK_DISCOUNT_RATE);
      discountRate = BULK_DISCOUNT_RATE;
    }
  }

  return { cartTotal, itemCnt, originalTotal, discountRate };
};

const renderCartTotal = (cartTotal, discountRate) => {
  cartTotalDisplay.textContent = '총액: ' + Math.round(cartTotal) + '원';
  if (discountRate > 0) {
    const discountRateSpan = document.createElement('span');
    discountRateSpan.className = 'text-green-500 ml-2';
    discountRateSpan.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotalDisplay.appendChild(discountRateSpan);
  }

  return { cartTotal, discountRate };
};

// 보너스 포인트 계산 및 표시
const renderBonusPoints = () => {
  bonusPoints = Math.floor(cartTotal / 1000);
  let $points = document.getElementById('loyalty-points');

  if (!$points) {
    $points = document.createElement('span');
    $points.id = 'loyalty-points';
    $points.className = 'text-blue-500 ml-2';
    cartTotalDisplay.appendChild($points);
  }

  $points.textContent = '(포인트: ' + bonusPoints + ')';
};

// 상품의 재고 정보 알려주기
function updateStockInfo() {
  let infoMsg = '';
  products.forEach(product => {
    if (product.quantity < 5) {
      infoMsg += product.name + ': ' + (product.quantity > 0 ? '재고 부족 (' + product.quantity + '개 남음)' : '품절') + '\n';
    }
  });
  stockInfo.textContent = infoMsg;
}

main();

// 상품 추가하는 버튼의 이벤트 핸들러
addProductButton.addEventListener('click', function () {
  // 선택한 상품의 정보 찾기
  const selectedId = productSelect.value;
  let selectedProduct = products.find(function (product) {
    return product.id === selectedId;
  });

  // 선택한 상품이 존재하고 재고가 없는 경우 반환
  if (!isInStock(selectedProduct)) {
    return;
  }

  const $selectedProduct = document.getElementById(selectedProduct.id);

  // 선택한 상품이 장바구니에 없는 경우
  if (!$selectedProduct) {
    createCartItemElement(selectedProduct);
  } else {
    const updatedQuantity = getCurrentQuantity($selectedProduct) + 1;

    // 선택한 상품의 재고가 없는 경우
    if (updatedQuantity > selectedProduct.quantity) {
      alert('재고가 부족합니다.');
      return;
    }

    // 선택한 상품의 재고가 있는 경우
    $selectedProduct.querySelector('span').textContent = selectedProduct.name + ' - ' + selectedProduct.price + '원 x ' + updatedQuantity;
  }

  // 선택한 상품의 재고 감소
  selectedProduct.quantity--;
  calcCart();
  // 마지막 선택한 상품 체크
  lastSelect = selectedId;
});

// 선택한 상품이 존재하고 재고가 있는지 확인
const isInStock = selectedProduct => {
  return selectedProduct && selectedProduct.quantity > 0;
};

// 선택한 상품의 현재 수량 반환
const getCurrentQuantity = $selectedProduct => {
  return parseInt($selectedProduct.querySelector('span').textContent.split('x ')[1]);
};

const createCartItemElement = selectedProduct => {
  const newCartItem = document.createElement('div');
  newCartItem.id = selectedProduct.id;
  newCartItem.className = 'flex justify-between items-center mb-2';
  newCartItem.innerHTML =
    '<span>' +
    selectedProduct.name +
    ' - ' +
    selectedProduct.price +
    '원 x 1</span><div>' +
    '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
    selectedProduct.id +
    '" data-change="-1">-</button>' +
    '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
    selectedProduct.id +
    '" data-change="1">+</button>' +
    '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
    selectedProduct.id +
    '">삭제</button></div>';
  return cartContainer.appendChild(newCartItem);
};

// 장바구니에서 수량 +/- 버튼 또는 삭제 버튼 클릭 이벤트 핸들러
cartContainer.addEventListener('click', function (event) {
  const target = event.target;

  // target에 두 클래스가 모두 없는 경우 반환
  if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) {
    return;
  }

  // 선택한 상품 찾기
  const productId = target.dataset.productId;
  const $selectedProduct = document.getElementById(productId);
  const selectedProduct = products.find(product => {
    return product.id === productId;
  });

  // 수량 변경 버튼일 경우
  if (target.classList.contains('quantity-change')) {
    const quantityChange = parseInt(target.dataset.change);
    const updatedQuantity = getCurrentQuantity($selectedProduct) + quantityChange;
    updatedQuantityChange(quantityChange, updatedQuantity, $selectedProduct, selectedProduct);
  }

  // 삭제 버튼일 경우
  if (target.classList.contains('remove-item')) {
    const removeQuantity = getCurrentQuantity($selectedProduct);
    selectedProduct.quantity += removeQuantity;
    $selectedProduct.remove();
  }

  calcCart();
});

// 수량 변경 버튼(+/-) 클릭 시 수량 증가 및 재고 확인
const updatedQuantityChange = (quantityChange, updatedQuantity, $selectedProduct, selectedProduct) => {
  if (updatedQuantity > 0 && updatedQuantity <= selectedProduct.quantity + getCurrentQuantity($selectedProduct)) {
    $selectedProduct.querySelector('span').textContent = $selectedProduct.querySelector('span').textContent.split('x ')[0] + 'x ' + updatedQuantity;
    selectedProduct.quantity -= quantityChange;
  } else if (updatedQuantity <= 0) {
    $selectedProduct.remove();
    selectedProduct.quantity -= quantityChange;
  } else {
    alert('재고가 부족합니다.');
  }
};
