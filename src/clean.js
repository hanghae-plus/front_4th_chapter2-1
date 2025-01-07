/*****************************************************
 * 전역 상태 (React의 useState, Redux Store 등과 유사)
 *****************************************************/
const state = {
  productList: [
    { id: 'p1', name: '상품1', val: 10000, q: 50 },
    { id: 'p2', name: '상품2', val: 20000, q: 30 },
    { id: 'p3', name: '상품3', val: 30000, q: 20 },
    { id: 'p4', name: '상품4', val: 15000, q: 0 },
    { id: 'p5', name: '상품5', val: 25000, q: 10 },
  ],
  cartItems: {}, // { 'p1': 수량, 'p2': 수량, ... }
  bonusPoints: 0, // 누적 포인트
  lastSelectedId: null, // 마지막으로 선택한 상품 ID

  // 계산 결과
  totalAmount: 0,
  totalItemCount: 0,
};

/*****************************************************
 * 상태 변경 헬퍼: setState
 * - React의 setState나 useState와 유사한 개념으로,
 *   부분 업데이트 후 render()를 자동 호출
 *****************************************************/
function setState(partial) {
  Object.assign(state, partial);
  render(); // 상태가 바뀔 때마다 전체 UI 다시 그리기
}

/*****************************************************
 * 초기 진입점: 이벤트 바인딩 + 첫 렌더
 *****************************************************/
document.addEventListener('DOMContentLoaded', () => {
  initEvents();
  render();

  // 번개 세일 & 제안 이벤트 타이머 설정 (기존 로직 유지)
  startLightningSaleEvents();
  startSuggestionEvents();
});

/*****************************************************
 * 이벤트 초기화
 *****************************************************/
function initEvents() {
  // '추가' 버튼 이벤트
  document.addEventListener('click', (e) => {
    if (e.target.matches('#add-to-cart')) {
      addToCartHandler();
    }
  });

  // 장바구니 내 수량/삭제 버튼 이벤트
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quantity-change')) {
      changeCartItemQuantity(e);
    } else if (e.target.classList.contains('remove-item')) {
      removeCartItem(e);
    }
  });
}

/*****************************************************
 * render: 상태를 기반으로 전체 UI를 렌더링
 *****************************************************/
function render() {
  const $root = document.getElementById('app');
  $root.innerHTML = ''; // 기존 UI를 통째로 제거(간단화)

  // 최상위 래퍼
  const $container = document.createElement('div');
  $container.className = 'bg-gray-100 p-8';

  // 내부 래퍼
  const $wrapper = document.createElement('div');
  $wrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  // 타이틀
  const $title = document.createElement('h1');
  $title.className = 'text-2xl font-bold mb-4';
  $title.textContent = '장바구니';

  // 장바구니 영역
  const $cartContainer = renderCartContainer(); // 장바구니 아이템 목록
  const $cartTotal = renderCartTotal(); // 장바구니 합계 & 포인트

  // 상품 선택 셀렉트 + 추가 버튼
  const $productSelect = renderProductSelect();
  const $addBtn = renderAddButton();

  // 재고 알림 영역
  const $stockStatus = renderStockStatus();

  // 조립
  $wrapper.appendChild($title);
  $wrapper.appendChild($cartContainer);
  $wrapper.appendChild($cartTotal);
  $wrapper.appendChild($productSelect);
  $wrapper.appendChild($addBtn);
  $wrapper.appendChild($stockStatus);
  $container.appendChild($wrapper);
  $root.appendChild($container);

  // 상태 기반 계산 (cartTotal, discount 등 갱신)
  recalcCart();
}

/*****************************************************
 * (컴포넌트) 상품 선택 Select
 *****************************************************/
function renderProductSelect() {
  const $select = document.createElement('select');
  $select.id = 'product-select';
  $select.className = 'border rounded p-2 mr-2';

  // 상품 옵션
  state.productList.forEach((product) => {
    const $option = document.createElement('option');
    $option.value = product.id;
    $option.textContent = `${product.name} - ${product.val}원`;
    if (product.q === 0) $option.disabled = true;
    $select.appendChild($option);
  });

  return $select;
}

/*****************************************************
 * (컴포넌트) '추가' 버튼
 *****************************************************/
function renderAddButton() {
  const $button = document.createElement('button');
  $button.id = 'add-to-cart';
  $button.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $button.textContent = '추가';
  return $button;
}

/*****************************************************
 * (컴포넌트) 장바구니 컨테이너 (아이템 목록)
 *****************************************************/
function renderCartContainer() {
  const $cartContainer = document.createElement('div');
  $cartContainer.id = 'cart-items';

  // cartItems: {'p1': 2, 'p2': 5 ...}
  Object.keys(state.cartItems).forEach((productId) => {
    const product = state.productList.find((p) => p.id === productId);
    if (!product) return;

    const qty = state.cartItems[productId];
    const $item = createCartItemElement(product, qty);
    $cartContainer.appendChild($item);
  });
  return $cartContainer;
}

/*****************************************************
 * (컴포넌트) 장바구니 합계 표시
 *****************************************************/
function renderCartTotal() {
  const $cartTotal = document.createElement('div');
  $cartTotal.id = 'cart-total';
  $cartTotal.className = 'text-xl font-bold my-4';

  // 재계산 후 표시 (단, 여기서는 render 시점을 고려해 별도 호출)
  // 우선은 "합계: 0원" 등 간단히 표시하고,
  // recalcCart()가 수행된 뒤 실제 수치로 업데이트
  $cartTotal.textContent = `총액: ${state.totalAmount}원`;

  // 보너스 포인트 표시
  const $pts = document.createElement('span');
  $pts.id = 'loyalty-points';
  $pts.className = 'text-blue-500 ml-2';
  $pts.textContent = `(포인트: ${state.bonusPoints})`;
  $cartTotal.appendChild($pts);

  return $cartTotal;
}

/*****************************************************
 * (컴포넌트) 재고 상태 표시
 *****************************************************/
function renderStockStatus() {
  const $stock = document.createElement('div');
  $stock.id = 'stock-status';
  $stock.className = 'text-sm text-gray-500 mt-2';

  // 재고 5개 미만인 상품 표시
  let infoMsg = '';
  state.productList.forEach((item) => {
    if (item.q < 5) {
      infoMsg += `${item.name}: ${
        item.q > 0 ? `재고 부족 (${item.q}개 남음)` : '품절'
      }\n`;
    }
  });
  $stock.textContent = infoMsg.trim();
  return $stock;
}

/*****************************************************
 * (서브 컴포넌트) 장바구니 아이템 DOM
 *****************************************************/
function createCartItemElement(product, qty) {
  const $item = document.createElement('div');
  $item.id = product.id;
  $item.className = 'flex justify-between items-center mb-2';
  $item.innerHTML = `
    <span>${product.name} - ${product.val}원 x ${qty}</span>
    <div>
      <button 
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
        data-product-id="${product.id}" 
        data-change="-1">-</button>
      <button 
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
        data-product-id="${product.id}" 
        data-change="1">+</button>
      <button 
        class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
        data-product-id="${product.id}">삭제</button>
    </div>
  `;
  return $item;
}

/*****************************************************
 * 장바구니 재계산 + 상태 업데이트
 *****************************************************/
function recalcCart() {
  const { totalAmount, totalItemCount, bonusPoints } = calculateCart(
    state.productList,
    state.cartItems,
    state.bonusPoints
  );

  // setState로 변경 시 render()를 또 호출하기 때문에,
  // 여기서는 최종 값만 state에 반영하고 끝냅니다.
  state.totalAmount = totalAmount;
  state.totalItemCount = totalItemCount;
  state.bonusPoints = bonusPoints;

  // 이미 render() 진행 중이므로, 수치만 DOM에 업데이트
  const $cartTotal = document.getElementById('cart-total');
  if ($cartTotal) {
    $cartTotal.textContent = `총액: ${totalAmount}원`;
    // 보너스 포인트
    const $pts = document.getElementById('loyalty-points');
    if ($pts) {
      $pts.textContent = `(포인트: ${bonusPoints})`;
      $cartTotal.appendChild($pts);
    }
  }
}

/*****************************************************
 * 장바구니 계산 로직 (순수 함수)
 * - 상품별 할인, 대량 구매 할인, 화요일 할인, 포인트 적립 등
 *****************************************************/
function calculateCart(productList, cartItems, currentBonusPoints) {
  let totalAmount = 0;
  let totalItemCount = 0;

  // 1) 상품별 합산
  let subTotal = 0;
  Object.entries(cartItems).forEach(([productId, qty]) => {
    const product = productList.find((p) => p.id === productId);
    if (!product) return;

    const itemPrice = product.val * qty;
    subTotal += itemPrice;
    totalItemCount += qty;

    // 10개 이상 구매 시 상품별 할인
    const itemDiscount = getItemDiscount(productId, qty);
    totalAmount += itemPrice * (1 - itemDiscount);
  });

  // 2) 대량 구매 할인 (30개 이상 → 25%)
  const BULK_THRESHOLD = 30;
  const BULK_RATE = 0.25;
  if (totalItemCount >= BULK_THRESHOLD) {
    const bulkDiscAmount = subTotal * (1 - BULK_RATE); // 대량 구매 할인
    // 기존 totalAmount(품목별 할인 적용)와 비교, 더 싼 쪽으로 결정
    totalAmount = Math.min(totalAmount, bulkDiscAmount);
  }

  // 3) 화요일 할인
  const TUESDAY = 2;
  const TUESDAY_RATE = 0.1;
  if (new Date().getDay() === TUESDAY) {
    totalAmount *= 1 - TUESDAY_RATE;
  }

  // 4) 포인트 적립: 기존 포인트 + (총액 / 1000)
  currentBonusPoints += Math.floor(totalAmount / 1000);

  // 소수점 반올림
  totalAmount = Math.round(totalAmount);

  return {
    totalAmount,
    totalItemCount,
    bonusPoints: currentBonusPoints,
  };
}

/*****************************************************
 * 상품별 할인율 계산 (수량 10개 이상 구매 시)
 *****************************************************/
function getItemDiscount(productId, qty) {
  if (qty < 10) return 0;
  const ITEM_DISCOUNTS = {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  };
  return ITEM_DISCOUNTS[productId] || 0;
}

/*****************************************************
 * '추가' 버튼 클릭 핸들러
 *****************************************************/
function addToCartHandler() {
  const $select = document.getElementById('product-select');
  if (!$select) return;

  const selectedId = $select.value;
  const product = state.productList.find((p) => p.id === selectedId);
  if (!product || product.q <= 0) return;

  // cartItems에 추가
  const currentQty = state.cartItems[selectedId] || 0;
  // 재고 확인
  if (currentQty + 1 > product.q) {
    alert('재고가 부족합니다.');
    return;
  }

  // 장바구니 수량 업데이트, 재고 감소
  const updatedCartItems = { ...state.cartItems };
  updatedCartItems[selectedId] = currentQty + 1;
  product.q -= 1;

  setState({
    cartItems: updatedCartItems,
    lastSelectedId: selectedId,
  });
}

/*****************************************************
 * 장바구니 수량 +/- 버튼 핸들러
 *****************************************************/
function changeCartItemQuantity(e) {
  const productId = e.target.dataset.productId;
  const qtyChange = parseInt(e.target.dataset.change, 10);
  const product = state.productList.find((p) => p.id === productId);

  if (!productId || !product) return;

  const currentQty = state.cartItems[productId] || 0;
  const newQty = currentQty + qtyChange;

  // 0 이하 → 아이템 삭제 처리
  if (newQty <= 0) {
    removeCartItemById(productId, currentQty);
    return;
  }

  // 증가하는 경우 재고 확인
  if (qtyChange > 0 && newQty > product.q + currentQty) {
    alert('재고가 부족합니다.');
    return;
  }

  // 정상 수량 → 재고 업데이트
  product.q -= qtyChange;
  const updatedCartItems = { ...state.cartItems };
  updatedCartItems[productId] = newQty;

  setState({ cartItems: updatedCartItems });
}

/*****************************************************
 * 장바구니 아이템 삭제 버튼 핸들러
 *****************************************************/
function removeCartItem(e) {
  const productId = e.target.dataset.productId;
  const product = state.productList.find((p) => p.id === productId);
  if (!product) return;

  const currentQty = state.cartItems[productId] || 0;
  removeCartItemById(productId, currentQty);
}

/*****************************************************
 * 특정 ID의 장바구니 아이템을 삭제하고 재고 복구
 *****************************************************/
function removeCartItemById(productId, qty) {
  const product = state.productList.find((p) => p.id === productId);
  if (!product) return;

  // 재고 복원
  product.q += qty;

  const updatedCartItems = { ...state.cartItems };
  delete updatedCartItems[productId];

  setState({ cartItems: updatedCartItems });
}

/*****************************************************
 * 번개 세일 이벤트 & 상품 제안 이벤트
 * (기존 로직 - setInterval)
 *****************************************************/
function startLightningSaleEvents() {
  // 랜덤 지연 후 30초 간격 체크
  setTimeout(() => {
    setInterval(() => {
      if (Math.random() < 0.3) {
        const item = getRandomItemInStock();
        if (item) {
          item.val = Math.round(item.val * 0.8);
          alert(`번개세일! ${item.name}이(가) 20% 할인 중입니다!`);
          setState({}); // 단순 재렌더 유도
        }
      }
    }, 30000);
  }, Math.random() * 10000);
}

function startSuggestionEvents() {
  // 랜덤 지연 후 60초 간격 체크
  setTimeout(() => {
    setInterval(() => {
      if (!state.lastSelectedId) return;
      // 다른 상품 중 재고 있는 상품
      const suggestion = state.productList.find(
        (p) => p.id !== state.lastSelectedId && p.q > 0
      );
      if (suggestion) {
        alert(
          `${suggestion.name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`
        );
        suggestion.val = Math.round(suggestion.val * 0.95);
        setState({}); // 단순 재렌더 유도
      }
    }, 60000);
  }, Math.random() * 20000);
}

/*****************************************************
 * 재고가 있는 임의의 상품 반환
 *****************************************************/
function getRandomItemInStock() {
  const inStock = state.productList.filter((item) => item.q > 0);
  if (inStock.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * inStock.length);
  return inStock[randomIndex];
}
