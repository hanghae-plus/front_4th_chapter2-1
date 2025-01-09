import { DISCOUNTS, BULK_DISCOUNT, SPETIAL_DISCOUNT } from './constants/cart';
import { WEEKDAY } from './constants/common';

// =====================
// 상태 초기화
// =====================
const state = {
  productList: [
    { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
  ],
  lastSelectedProduct: null,
  totalAmount: 0,
  itemCount: 0,
};

const elements = {
  cartDisplay: null,
  totalAmountDisplay: null,
  selectedProduct: null,
  addToCartButton: null,
  stockInfoDisplay: null,
};

// =====================
// 메인 실행 함수
// =====================
function main() {
  // DOM 요소들 생성 및 innerHTML로 구성
  const root = document.getElementById('app');
  root.innerHTML = `
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

  elements.cartDisplay = document.getElementById('cart-items');
  elements.totalAmountDisplay = document.getElementById('cart-total');
  elements.selectedProduct = document.getElementById('product-select');
  elements.addToCartButton = document.getElementById('add-to-cart');
  elements.stockInfoDisplay = document.getElementById('stock-status');

  updateProductSelectOptions();
  calculateCart();

  // 번개세일 및 추천 상품 이벤트 실행
  offerLuckySale();
  offerSuggestedProduct();
}

// =====================
// 특별 이벤트 처리 (번개세일, 추천 상품)
// =====================

// 번개세일 이벤트
const offerLuckySale = () => {
  const luckyItem = state.productList[Math.floor(Math.random() * state.productList.length)];

  if (Math.random() < 0.3 && luckyItem.quantity > 0) {
    luckyItem.value = Math.round(luckyItem.price * SPETIAL_DISCOUNT.LUCKY);
    alert(`번개세일! ${luckyItem.name}이(가) 20% 할인 중입니다!`);
    updateProductSelectOptions();
  }

  // 랜덤 시간 (0초 ~ 20초 사이) 후 번개세일 이벤트 실행
  setTimeout(offerLuckySale, Math.random() * 20000);
};

// 추천 상품 이벤트
const offerSuggestedProduct = () => {
  if (state.lastSelectedProduct) {
    const suggestedItem = state.productList.find(function (item) {
      return item.id !== state.lastSelectedProduct && item.quantity > 0;
    });

    if (suggestedItem) {
      alert(`${suggestedItem.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`);
      suggestedItem.price = Math.round(suggestedItem.price * SPETIAL_DISCOUNT.SUGGESTED);
      updateProductSelectOptions();
    }
  }

  // 랜덤 시간 (0초 ~ 30초 사이) 후 추천 상품 이벤트 실행
  setTimeout(offerSuggestedProduct, Math.random() * 30000);
};

// =====================
// 장바구니 관련 함수
// =====================

// 제품 선택 옵션 업데이트
const updateProductSelectOptions = () => {
  elements.selectedProduct.innerHTML = state.productList
    .map(
      (item) =>
        `<option value="${item.id}" ${item.quantity === 0 ? 'disabled' : ''}>${item.name} - ${item.price}원</option>`,
    )
    .join('')
    .trim();
};

// 장바구니 계산
const calculateCart = () => {
  state.totalAmount = 0;
  state.itemCount = 0;

  const cartItems = Array.from(elements.cartDisplay.children);
  const subTotal = calculateSubTotal(cartItems);

  let discountRate = applyBulkDiscount(subTotal);
  discountRate = applyWeekdayDiscount(discountRate);

  updateTotalAmountDisplay(discountRate);
  updateStockInfo();
  renderBonusPoints();
};

// =====================
// 총액 및 할인 계산 함수
// =====================

// 장바구니 총액 계산
const calculateSubTotal = (cartItems) =>
  cartItems.reduce((subTotal, item) => {
    const { currentItem, quantity } = getItemInfo(item);
    const itemTotal = currentItem.price * quantity;

    state.itemCount += quantity;
    state.totalAmount += applyItemDiscount(currentItem, itemTotal, quantity);

    return subTotal + itemTotal;
  }, 0);

// 상품 정보 및 수량 추출
const getItemInfo = (cartItem) => {
  const currentItem = state.productList.find((p) => p.id === cartItem.id);
  const quantity = parseInt(cartItem.querySelector('span').textContent.split('x ')[1]);
  return { currentItem, quantity };
};

// 상품별 할인 적용
const applyItemDiscount = (item, total, quantity) => {
  let discount = 0;
  if (quantity >= 10) {
    discount = getItemDiscountRate(item.id);
  }
  return total * (1 - discount);
};

// 상품 ID별 할인율 반환
const getItemDiscountRate = (itemId) => {
  const discountMap = {
    p1: DISCOUNTS.RATE_10,
    p2: DISCOUNTS.RATE_15,
    p3: DISCOUNTS.RATE_20,
    p4: DISCOUNTS.RATE_5,
    p5: DISCOUNTS.RATE_25,
  };
  return discountMap[itemId] || 0;
};

// 대량 구매 할인 적용
const applyBulkDiscount = (subTotal) => {
  let discountRate = 0;
  if (state.itemCount >= BULK_DISCOUNT.THRESHOLD) {
    const bulkDiscount = state.totalAmount * BULK_DISCOUNT.RATE;
    const itemDiscount = subTotal - state.totalAmount;

    if (bulkDiscount > itemDiscount) {
      state.totalAmount = subTotal * (1 - BULK_DISCOUNT.RATE);
      discountRate = BULK_DISCOUNT.RATE;
    } else {
      discountRate = (subTotal - state.totalAmount) / subTotal;
    }
  } else {
    discountRate = (subTotal - state.totalAmount) / subTotal;
  }
  return discountRate;
};

// 화요일 추가 할인 적용
const applyWeekdayDiscount = (discountRate) => {
  if (new Date().getDay() === WEEKDAY.TUESDAY) {
    state.totalAmount *= 1 - DISCOUNTS.RATE_10;
    discountRate = Math.max(discountRate, DISCOUNTS.RATE_10);
  }
  return discountRate;
};

// =====================
// UI 업데이트 함수
// =====================

// 총액 및 할인율 표시
const updateTotalAmountDisplay = (discountRate) => {
  elements.totalAmountDisplay.textContent = `총액: ${Math.round(state.totalAmount)}원`;
  if (discountRate > 0) {
    displayDiscountRate(discountRate);
  }
};

// 할인율 표시 추가
const displayDiscountRate = (discountRate) => {
  const discountSpan = document.createElement('span');
  discountSpan.className = 'text-green-500 ml-2';
  discountSpan.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
  elements.totalAmountDisplay.appendChild(discountSpan);
};

// 보너스 포인트 렌더링 함수
const renderBonusPoints = () => {
  const bonusPoints = Math.floor(state.totalAmount / 1000);

  const pointsTag = document.querySelector('#loyalty-points');
  if (!pointsTag) {
    elements.totalAmountDisplay.innerHTML += `<span id="loyalty-points" class="text-blue-500 ml-2">(포인트: ${bonusPoints})</span>`;
  } else {
    pointsTag.textContent = `포인트: ${bonusPoints}`;
  }
};

// 재고 상태 업데이트
const updateStockInfo = () => {
  let infoMessage = '';
  state.productList.forEach(function (item) {
    if (item.quantity < 5) {
      infoMessage += `${item.name}: ${item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절'}\n`;
    }
  });
  elements.stockInfoDisplay.textContent = infoMessage;
};

// 초기화 실행
main();

// =====================
// 장바구니에 제품 추가 클릭 이벤트 처리
// =====================
elements.addToCartButton.addEventListener('click', () => {
  const selectedItem = elements.selectedProduct.value;
  const itemToAdd = state.productList.find((product) => product.id === selectedItem);

  if (itemToAdd && itemToAdd.quantity > 0) {
    const itemElement = document.getElementById(itemToAdd.id);

    // 이미 장바구니에 있는 경우 수량 업데이트
    if (itemElement) {
      updateQuantity(itemElement, itemToAdd);
    } else {
      // 새 항목 추가
      addNewItemToCart(itemToAdd);
    }

    calculateCart();
    state.lastSelectedProduct = selectedItem;
  }
});

// 수량 업데이트 처리 함수
const updateQuantity = (itemElement, itemToAdd) => {
  const currentQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
  const newQuantity = currentQuantity + 1;

  if (newQuantity <= itemToAdd.quantity) {
    itemElement.querySelector('span').textContent =
      `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQuantity}`;
    itemToAdd.quantity--;
  } else {
    alert('재고가 부족합니다.');
  }
};

// 새 항목 추가 처리 함수
const addNewItemToCart = (itemToAdd) => {
  elements.cartDisplay.insertAdjacentHTML(
    'beforeend',
    `
    <div id="${itemToAdd.id}" class="flex justify-between items-center mb-2">
      <span>${itemToAdd.name} - ${itemToAdd.price}원 x 1</span>
      <div>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="-1">-</button>
        <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${itemToAdd.id}" data-change="1">+</button>
        <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${itemToAdd.id}">삭제</button>
      </div>
    </div>
  `,
  );
  itemToAdd.quantity--;
};

// =====================
// 장바구니 항목 클릭 이벤트 처리
// =====================
elements.cartDisplay.addEventListener('click', (event) => {
  const targetElement = event.target;

  if (
    targetElement.classList.contains('quantity-change') ||
    targetElement.classList.contains('remove-item')
  ) {
    const productId = targetElement.dataset.productId;
    const itemElement = document.getElementById(productId);
    const product = state.productList.find((product) => product.id === productId);

    // 수량 변경 처리
    if (targetElement.classList.contains('quantity-change')) {
      handleQuantityChange(targetElement, itemElement, product);
    } else if (targetElement.classList.contains('remove-item')) {
      handleRemoveItem(itemElement, product);
    }

    calculateCart();
  }
});

// 수량 변경 처리 함수
const handleQuantityChange = (targetElement, itemElement, product) => {
  const quantityChange = parseInt(targetElement.dataset.change);
  const currentQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);
  const newQuantity = currentQuantity + quantityChange;

  if (newQuantity > 0 && newQuantity <= product.quantity + currentQuantity) {
    itemElement.querySelector('span').textContent =
      `${product.name} - ${product.price}원 x ${newQuantity}`;
    product.quantity -= quantityChange;
  } else if (newQuantity <= 0) {
    itemElement.remove();
    product.quantity -= currentQuantity;
  } else {
    alert('재고가 부족합니다.');
  }
};

// 항목 삭제 처리 함수
const handleRemoveItem = (itemElement, product) => {
  const removedQuantity = parseInt(itemElement.querySelector('span').textContent.split('x ')[1]);

  product.quantity += removedQuantity;
  itemElement.remove();
};
