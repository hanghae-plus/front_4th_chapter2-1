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

// 행운 상품 가져오기
const getLuckyItem = () =>
  productList[Math.floor(Math.random() * productList.length)];

// 추천 상품 가져오기
const getRecommendItem = () =>
  productList.find((item) => item.id !== App.lastSel && item.count > 0);

// 장바구니 항목의 수량 파싱
const parseItemCount = (textContent) => parseInt(textContent.split('x ')[1]);

// 오늘 요일 확인
const isSpecificDay = (dayNumber) => new Date().getDay() === dayNumber;

const productList = [
  { id: 'p1', name: '상품1', price: 10000, count: 50 },
  { id: 'p2', name: '상품2', price: 20000, count: 30 },
  { id: 'p3', name: '상품3', price: 30000, count: 20 },
  { id: 'p4', name: '상품4', price: 15000, count: 0 },
  { id: 'p5', name: '상품5', price: 25000, count: 10 },
]

const App = {
  cart: [],
  bonusPts: 0,
  totalAmt: 0,
  itemCnt: 0,
  lastSel: null,
  elements: {
    productSelectBox: null,
    cartAddBtn: null,
    cartList: null,
    cartTotal: null,
    stockStatus: null,
  },
};

const main = () => {
  const root = document.getElementById('app');

  const contHTML = `
    <div class="bg-gray-100 p-8">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 class="text-2xl font-bold mb-4">장바구니</h1>
        <div id="cart-items"></div>
        <div id="cart-total" class="text-xl font-bold my-4"></div>
        <select id="product-select" class="border rounded p-2 mr-2"></select>
        <button id="add-to-cart" class="bg-blue-500 text-white px-4 py-2 rounded">추가</button>
        <div id="stock-status" class="text-sm text-gray-500 mt-2"></div>
      </div>
    </div>
  `;

  root.innerHTML = contHTML;

  // 요소들 저장
  App.elements.productSelectBox = document.getElementById('product-select');
  App.elements.cartAddBtn = document.getElementById('add-to-cart');
  App.elements.cartList = document.getElementById('cart-items');
  App.elements.cartTotal = document.getElementById('cart-total');
  App.elements.stockStatus = document.getElementById('stock-status');

  updateProductOptionsUI();
  calculateCart();
  initializeTimers();
};

// 세일 이벤트 등록
const initializeTimers = () => {
  setTimeout(() => {
    setInterval(() => {
      let product = getLuckyItem();

      const isProductOnSale =
        Math.random() < SALE_PROBABILITY && product.count > 0;
      if (isProductOnSale) {
        product.price = Math.round(product.price * LUCKY_SALE_DISCOUNT_RATE);
        alert('번개세일! ' + product.name + '이(가) 20% 할인 중입니다!');
        updateProductOptionsUI();
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
        updateProductOptionsUI();
      }
    }, 60000);
  }, Math.random() * 20000);
};

// 상품 옵션 UI 업데이트
const updateProductOptionsUI = () => {
  productList.forEach((item) => {
    let optionHTML = `
      <option value="${item.id}" ${item.count === 0 ? 'disabled' : ''}>
        ${item.name} - ${item.price}원
      </option>
    `;
    App.productSelectBox.innerHTML += optionHTML;
  });
};

// 장바구니 항목, 할인 총액 초기화
const calculateSubTotals = () => {
  let cartItemElements = Array.from(App.cartList.children);
  let subTot = 0;

  cartItemElements.forEach((itemElement) => {
    const curItem = productList.find((item) => item.id === itemElement.id);
    const count = parseItemCount(itemElement.querySelector('span').textContent);
    const itemTot = curItem.price * count;
    const disc =
      count > 10 && DISCOUNT_RATES[curItem.id] ? DISCOUNT_RATES[curItem.id] : 0;

    App.itemCnt += count;
    subTot += itemTot;
    App.totalAmt += itemTot * (1 - disc);
  });

  return subTot;
};

// 대량 구매 할인 적용
const calculateBulkDiscount = (subTotal, totalAmount, totalQuantity) => {
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
};

// 카트 UI 업데이트
const updateCartUI = (discRate) => {
  App.cartTotal.textContent = '총액: ' + Math.round(App.totalAmt) + '원';

  // 할인율이 있을 경우 UI에 표시
  if (discRate > 0) {
    App.cartTotal.innerHTML += `
      <span class="text-green-500 ml-2">(${(discRate * 100).toFixed(1)}% 할인 적용)</span>
    `;
  }
};

// 장바구니 업데이트
const calculateCart = () => {
  App.totalAmt = 0;
  App.itemCnt = 0;

  // 장바구니 항목, 할인 총액 초기화
  const subTot = calculateSubTotals();

  let discRate = 0;

  // 대량 구매 할인 적용
  const { finalAmount, discountRate } = calculateBulkDiscount(
    subTot,
    App.totalAmt,
    App.itemCnt
  );
  App.totalAmt = finalAmount;
  discRate = discountRate;

  // 화요일 추가 할인 적용
  if (isSpecificDay(2)) {
    App.totalAmt *= 1 - TUESDAY_DISCOUNT_RATE;
    discRate = Math.max(discRate, TUESDAY_DISCOUNT_RATE);
  }

  // UI 업데이트
  updateCartUI(discRate);
  updateStockInfoUI();
  bonusPointsUI();
};

// 포인트 렌더링
const bonusPointsUI = () => {
  App.bonusPts = Math.floor(App.totalAmt / 1000);

  let pointsElement = document.getElementById('loyalty-points');

  if (pointsElement) {
    pointsElement.textContent = `(포인트: ${App.bonusPts})`;
  } else {
    App.cartTotal.innerHTML += `
    <span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${App.bonusPts})</span>
  `;
  }
};

// 재고 정보 렌더링
const updateStockInfoUI = () => {
  let infoMsg = '';

  productList.forEach((item) => {
    if (item.count < 5) {
      infoMsg += `${item.name}: ${item.count > 0 ? `재고 부족 (${item.count}개 남음)` : '품절'}\n`;
    }
  });

  App.stockStatus.textContent = infoMsg;
};

main();

// 상품 추가 이벤트
App.cartAddBtn.addEventListener('click', () => {
  let selectedItem = App.productSelectBox.value;
  let itemToAdd = productList.find(
    (product) => product.id === selectedItem
  );

  if (itemToAdd && itemToAdd.count > 0) {
    let itemElement = document.getElementById(itemToAdd.id);

    if (itemElement) {
      // 이미 장바구니에 있는 아이템의 수량 증가 처리
      let newQty =
        parseItemCount(itemElement.querySelector('span').textContent) + 1;

      if (newQty <= itemToAdd.count) {
        itemElement.querySelector('span').textContent =
          `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;
        itemToAdd.count--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새로 장바구니에 추가하는 아이템 처리
      let newItem = createCartItemUI(itemToAdd);
      App.cartList.appendChild(newItem);
      itemToAdd.count--;
    }

    calculateCart();
    App.lastSel = selectedItem;
  }
});

// 장바구니 아이템 UI 생성
function createCartItemUI(itemToAdd) {
  return `
    <div id="${itemToAdd.id}" class="flex justify-between items-center mb-2">
      <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
                data-product-id="${itemToAdd.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
                data-product-id="${itemToAdd.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
                data-product-id="${itemToAdd.id}">삭제</button>
      </div>
    </div>
  `;
}

// 장바구니 수량 변경 및 삭제 이벤트
App.cartList.addEventListener('click', (event) => {
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
  var currentQty = parseItemCount(
    itemElement.querySelector('span').textContent
  );
  var newQty = currentQty + qtyChange;

  if (newQty <= 0) {
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
