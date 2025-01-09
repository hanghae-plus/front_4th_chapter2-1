const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;
const TUESDAY_DISCOUNT_RATE = 0.1;
const SALE_PROBABILITY = 0.3;
const LUCKY_SALE_DISCOUNT_RATE = 0.8;
const RECOMMENDED_ITEM_DISCOUNT_RATE = 0.95;

let productSelectBox, cartAddBtn, cartList, cartTotal, stockStatus;
let lastSel,
  bonusPts = 0,
  totalAmt = 0,
  itemCnt = 0;

let productList = [
  { id: 'p1', name: '상품1', price: 10000, count: 50 },
  { id: 'p2', name: '상품2', price: 20000, count: 30 },
  { id: 'p3', name: '상품3', price: 30000, count: 20 },
  { id: 'p4', name: '상품4', price: 15000, count: 0 },
  { id: 'p5', name: '상품5', price: 25000, count: 10 },
];

// 요소 생성 함수
function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  if (options.id) element.id = options.id;
  if (options.className) element.className = options.className;
  if (options.textContent) element.textContent = options.textContent;
  if (options.value) element.value = options.value;
  return element;
}

// 행운 상품 가져오기
function getLuckyItem() {
  return productList[Math.floor(Math.random() * productList.length)];
}

// 추천 상품 가져오기기
function getRecommendItem() {
  return productList.find((item) => item.id !== lastSel && item.count > 0);
}

// 장바구니 항목의 수량 파싱
function parseItemCount(textContent) {
  return parseInt(textContent.split('x ')[1]);
}

// 오늘 요일 확인
function isSpecificDay(dayNumber) {
  return new Date().getDay() === dayNumber;
}

// 메인 함수
function main() {
  const root = document.getElementById('app');
  let cont = createElement('div', { className: 'bg-gray-100 p-8' });
  let wrap = createElement('div', {
    className:
      'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  });
  let hTxt = createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니',
  });

  cont.appendChild(wrap);
  root.appendChild(cont);
  wrap.appendChild(hTxt);

  cartList = createElement('div', { id: 'cart-items' });
  wrap.appendChild(cartList);

  cartTotal = createElement('div', {
    id: 'cart-total',
    className: 'text-xl font-bold my-4',
  });
  wrap.appendChild(cartTotal);

  productSelectBox = createElement('select', {
    id: 'product-select',
    className: 'border rounded p-2 mr-2',
  });
  wrap.appendChild(productSelectBox);

  cartAddBtn = createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
  });
  wrap.appendChild(cartAddBtn);

  stockStatus = createElement('div', {
    id: 'stock-status',
    className: 'text-sm text-gray-500 mt-2',
  });
  wrap.appendChild(stockStatus);

  updateProductOptions();
  calculateCart();

  initializeTimers();
}

// 세일 이벤트 등록
function initializeTimers() {
  setTimeout(() => {
    setInterval(() => {
      let product = getLuckyItem();

      const isProductOnSale = Math.random() < SALE_PROBABILITY && product.count > 0;
      if (isProductOnSale) {
        product.price = Math.round(product.price * LUCKY_SALE_DISCOUNT_RATE);
        alert('번개세일! ' + product.name + '이(가) 20% 할인 중입니다!');
        updateProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  setTimeout(() => {
    setInterval(() => {
      let product = getRecommendItem();

      if (product) {
        alert(product.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
        product.price = Math.round(
          product.price * RECOMMENDED_ITEM_DISCOUNT_RATE
        );
        updateProductOptions();
      }
    }, 60000);
  }, Math.random() * 20000);
}

// 상품 옵션 업데이트
function updateProductOptions() {
  productSelectBox.innerHTML = '';
  productList.forEach((item) => {
    let opt = createElement('option', {
      value: item.id,
      textContent: item.name + ' - ' + item.price + '원',
    });

    if (item.count === 0) opt.disabled = true;
    productSelectBox.appendChild(opt);
  });
}

// 장바구니 항목, 할인 총액 초기화
function calculateSubTotals() {
  let cartItemElements = Array.from(cartList.children);
  let subTot = 0;

  cartItemElements.forEach((itemElement) => {
    const curItem = productList.find((item) => item.id === itemElement.id);
    const count = parseItemCount(itemElement.querySelector('span').textContent);
    const itemTot = curItem.price * count;
    const disc =
      count > 10 && DISCOUNT_RATES[curItem.id] ? DISCOUNT_RATES[curItem.id] : 0;

    itemCnt += count;
    subTot += itemTot;
    totalAmt += itemTot * (1 - disc);
  });

  return subTot;
}

// 대량 구매 할인 적용
function calculateBulkDiscount(subTotal, totalAmount, totalQuantity) {
  if (totalQuantity >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscountAmount = subTotal * BULK_DISCOUNT_RATE;
    const individualDiscountAmount = subTotal - totalAmount;

    if (bulkDiscountAmount > individualDiscountAmount) {
      return {
        finalAmount: subTotal * (1 - BULK_DISCOUNT_RATE),
        discountRate: BULK_DISCOUNT_RATE,
      };
    }
  }

  return {
    finalAmount: totalAmount,
    discountRate: (subTotal - totalAmount) / subTotal,
  };
}

// 카드 UI 업데이트
function updateCartUI(discRate) {
  cartTotal.textContent = '총액: ' + Math.round(totalAmt) + '원';

  // 할인율이 있을 경우 UI에 표시
  if (discRate > 0) {
    let discountMsg = createElement('span', {
      className: 'text-green-500 ml-2',
      textContent: '(' + (discRate * 100).toFixed(1) + '% 할인 적용)',
    });
    cartTotal.appendChild(discountMsg);
  }
}

// 장바구니 업데이트
function calculateCart() {
  totalAmt = 0;
  itemCnt = 0;

  // 장바구니 항목, 할인 총액 초기화
  const subTot = calculateSubTotals();

  let discRate = 0;

  // 대량 구매 할인 적용
  const { finalAmount, discountRate } = calculateBulkDiscount(
    subTot,
    totalAmt,
    itemCnt
  );
  totalAmt = finalAmount;
  discRate = discountRate;

  // 화요일 추가 할인 적용
  if (isSpecificDay(2)) {
    totalAmt *= 1 - TUESDAY_DISCOUNT_RATE;
    discRate = Math.max(discRate, TUESDAY_DISCOUNT_RATE);
  }

  // UI 업데이트
  updateCartUI(discRate);
  updateStockInfo();
  renderBonusPoints();
}

// 포인트 렌더링
const renderBonusPoints = () => {
  bonusPts = Math.floor(totalAmt / 1000);

  let pointsElement = document.getElementById('loyalty-points');

  if (!pointsElement) {
    pointsElement = createElement('span', {
      id: 'loyalty-points',
      className: 'text-blue-500 ml-2',
    });
    cartTotal.appendChild(pointsElement);
  }

  pointsElement.textContent = '(포인트: ' + bonusPts + ')';
};

// 재고 정보 렌더링
function updateStockInfo() {
  let infoMsg = '';

  productList.forEach((item) => {
    if (item.count < 5) {
      infoMsg += `${item.name}: ${item.count > 0 ? `재고 부족 (${item.count}개 남음)` : '품절'}\n`;
    }
  });

  stockStatus.textContent = infoMsg;
}

main();

// 상품 추가 이벤트
cartAddBtn.addEventListener('click', () => {
  let selectedItem = productSelectBox.value;
  let itemToAdd = productList.find((product) => product.id === selectedItem);

  if (itemToAdd && itemToAdd.count > 0) {
    let itemElement = document.getElementById(itemToAdd.id);

    if (itemElement) {
      // 이미 장바구니에 있는 아이템의 수량 증가 처리
      let newQty = parseItemCount(itemElement.querySelector('span').textContent) + 1;

      if (newQty <= itemToAdd.count) {
        itemElement.querySelector('span').textContent =
          `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;
        itemToAdd.count--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새로 장바구니에 추가하는 아이템 처리
      let newItem = createCartItem(itemToAdd);
      cartList.appendChild(newItem);
      itemToAdd.count--;
    }

    calculateCart();
    lastSel = selectedItem;
  }
});

// 장바구니 아이템 생성
function createCartItem(itemToAdd) {
  let newItem = document.createElement('div');
  newItem.id = itemToAdd.id;
  newItem.className = 'flex justify-between items-center mb-2';

  newItem.innerHTML = `
    <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
    <div>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
              data-product-id="${itemToAdd.id}" data-change="-1">-</button>
      <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
              data-product-id="${itemToAdd.id}" data-change="1">+</button>
      <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
              data-product-id="${itemToAdd.id}">삭제</button>
    </div>
  `;

  return newItem;
}

// 장바구니 수량 변경 및 삭제 이벤트
cartList.addEventListener('click', (event) => {
  let target = event.target;
  let prodId = target.dataset.productId;
  let itemElement = document.getElementById(prodId);
  let product = productList.find((product) => product.id === prodId);

  const isQuantityChange = target.classList.contains('quantity-change');
  const isRemoveItem = target.classList.contains('remove-item');

  if (isQuantityChange) {
    handleQuantityChange(target, itemElement, product);
  } else if (isRemoveItem) {
    handleRemoveItem(itemElement, product);
  }

  calculateCart();
});

// 수량 변경 처리 함수
function handleQuantityChange(target, itemElement, product) {
  var qtyChange = parseInt(target.dataset.change);
  var currentQty = parseItemCount(itemElement.querySelector('span').textContent);
  var newQty = currentQty + qtyChange;

  if (newQty <= 0 ) {
    itemElement.remove();
    product.count -= qtyChange;
  } else if (newQty <= product.count + currentQty) {
    updateItemQuantity(itemElement, newQty);
    product.count -= qtyChange;
  } else {
    alert('재고가 부족합니다.');
  }
}

// 아이템 제거
function handleRemoveItem(itemElement, product) {
  var remQty = parseItemCount(itemElement.querySelector('span').textContent);
  product.count += remQty;
  itemElement.remove();
}

// 아이템 수량 업데이트
function updateItemQuantity(itemElem, newQty) {
  var itemText = itemElem.querySelector('span').textContent.split('x ')[0];
  itemElem.querySelector('span').textContent = `${itemText}x ${newQty}`;
}
