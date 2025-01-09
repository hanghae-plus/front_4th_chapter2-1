// 매직넘버 정의
const DISCOUNTS = {
  BULK: 0.25,
  TUESDAY: 0.1,
  PRODUCT_SPECIFIC: {
    p1: 0.1,
    p2: 0.15,
    p3: 0.2,
    p4: 0.05,
    p5: 0.25,
  },
};

const UI_CLASSES = {
  CONTAINER: 'bg-gray-100 p-8',
  WRAPPER: 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8',
  HEADING: 'text-2xl font-bold mb-4',
  TOTAL: 'text-xl font-bold my-4',
  SELECT: 'border rounded p-2 mr-2',
  ADD_BUTTON: 'bg-blue-500 text-white px-4 py-2 rounded',
  STOCK_STATUS: 'text-sm text-gray-500 mt-2',
  CART_ITEM: 'flex justify-between items-center mb-2',
  QUANTITY_BUTTON: 'bg-blue-500 text-white px-2 py-1 rounded mr-1',
  REMOVE_BUTTON: 'bg-red-500 text-white px-2 py-1 rounded',
  DISCOUNT_TEXT: 'text-green-500 ml-2',
  POINTS_TEXT: 'text-blue-500 ml-2',
};

const UI_TEXT = {
  CART_TITLE: '장바구니',
  ADD_BUTTON: '추가',
  REMOVE_BUTTON: '삭제',
  LOW_STOCK: '재고 부족',
  OUT_OF_STOCK: '품절',
  FLASH_SALE: '번개세일!',
  FLASH_SALE_MESSAGE: '이(가) 20% 할인 중입니다!',
  RECOMMEND_MESSAGE: '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!',
  LOW_STOCK_MESSAGE: '개 남음',
  STOCK_ERROR: '재고가 부족합니다.',
};

// cart 상태관리
const createCartState = () => {
  let state = {
    lastSelectedProductId: null,
    bonusPoints: 0,
    totalAmount: 0,
    itemCount: 0,
  };

  return {
    get: () => ({ ...state }),
    set: (newState) => {
      state = { ...state, ...newState };
    },
  };
};

// 상품 데이터 (상품 ID, 이름, 가격 재고)
const productList = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

// DOM 요소 초기화
const root = document.getElementById('app');
const container = document.createElement('div');
const wrapper = document.createElement('div');
const heading = document.createElement('h1');
const cartDisplay = document.createElement('div');
const totalDisplay = document.createElement('div');
const productSelect = document.createElement('select');
const addButton = document.createElement('button');
const stockStatus = document.createElement('div');

const initializeUIElements = () => {
  // id 부여
  cartDisplay.id = 'cart-items';
  totalDisplay.id = 'cart-total';
  productSelect.id = 'product-select';
  addButton.id = 'add-to-cart';
  stockStatus.id = 'stock-status';

  // classname 부여
  container.className = UI_CLASSES.CONTAINER;
  wrapper.className = UI_CLASSES.WRAPPER;
  heading.className = UI_CLASSES.HEADING;
  totalDisplay.className = UI_CLASSES.TOTAL;
  productSelect.className = UI_CLASSES.SELECT;
  addButton.className = UI_CLASSES.ADD_BUTTON;
  stockStatus.className = UI_CLASSES.STOCK_STATUS;

  // 텍스트 부여
  heading.textContent = UI_TEXT.CART_TITLE;
  addButton.textContent = UI_TEXT.ADD_BUTTON;
};

// 상품 목록을 드롭다운에 추가
function updateSelOpts() {
  productSelect.innerHTML = ''; // 기존 옵션 제거
  productList.forEach(function (item) {
    let opt = document.createElement('option');
    opt.value = item.id; // 상품 ID
    opt.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) opt.disabled = true; // 재고 없는 상품 비활성화
    productSelect.appendChild(opt);
  });
}

function calcCart(cartState) {
  let cartItems = cartDisplay.children;
  let subTot = 0;
  let currentItemCount = 0;
  let currentTotal = 0;

  for (let i = 0; i < cartItems.length; i++) {
    const curItem = productList.find((item) => item.id === cartItems[i].id);
    const quantity = parseInt(cartItems[i].querySelector('span').textContent.split('x ')[1]);
    const itemTotal = curItem.price * quantity;
    let discount = 0;

    currentItemCount += quantity;
    subTot += itemTotal;

    if (quantity >= 10) {
      discount = DISCOUNTS.PRODUCT_SPECIFIC[curItem.id] || 0;
    }
    currentTotal += itemTotal * (1 - discount);
  }

  let discountRate = 0;

  if (currentItemCount >= 30) {
    let bulkDiscount = currentTotal * DISCOUNTS.BULK;
    let itemDiscount = subTot - currentTotal;
    if (bulkDiscount > itemDiscount) {
      currentTotal = subTot * (1 - DISCOUNTS.BULK);
      discountRate = DISCOUNTS.BULK;
    } else {
      discountRate = (subTot - currentTotal) / subTot;
    }
  } else {
    discountRate = (subTot - currentTotal) / subTot || 0;
  }

  if (new Date().getDay() === 2) {
    currentTotal *= 1 - DISCOUNTS.TUESDAY;
    discountRate = Math.max(discountRate, DISCOUNTS.TUESDAY);
  }

  cartState.set({
    totalAmount: currentTotal,
    itemCount: currentItemCount,
    bonusPoints: Math.floor(currentTotal / 1000),
  });

  totalDisplay.textContent = '총액: ' + Math.round(cartState.get().totalAmount) + '원';

  if (discountRate > 0) {
    let span = document.createElement('span');
    span.className = UI_CLASSES.DISCOUNT_TEXT;
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    totalDisplay.appendChild(span);
  }

  updateStockInfo();
  renderBonusPoints(cartState);
}

const renderBonusPoints = (cartState) => {
  let ptsTag = document.getElementById('loyalty-points');
  if (!ptsTag) {
    ptsTag = document.createElement('span');
    ptsTag.id = 'loyalty-points';
    ptsTag.className = UI_CLASSES.POINTS_TEXT;
    totalDisplay.appendChild(ptsTag);
  }
  ptsTag.textContent = '(포인트: ' + cartState.get().bonusPoints + ')';
};

function updateStockInfo() {
  let infoMsg = '';
  productList.forEach(function (item) {
    if (item.quantity < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') +
        '\n';
    }
  });
  stockStatus.textContent = infoMsg;
}

function setupEventListeners(cartState) {
  addButton.addEventListener('click', function () {
    let selItem = productSelect.value;
    let itemToAdd = productList.find((p) => p.id === selItem);

    if (itemToAdd && itemToAdd.quantity > 0) {
      let item = document.getElementById(itemToAdd.id);
      if (item) {
        let newQty = parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;
        if (newQty <= itemToAdd.quantity) {
          item.querySelector('span').textContent =
            itemToAdd.name + ' - ' + itemToAdd.price + '원 x ' + newQty;
          itemToAdd.quantity--;
        } else {
          alert(UI_TEXT.STOCK_ERROR);
        }
      } else {
        let newItem = document.createElement('div');
        newItem.id = itemToAdd.id;
        newItem.className = UI_CLASSES.CART_ITEM;
        newItem.innerHTML =
          '<span>' +
          itemToAdd.name +
          ' - ' +
          itemToAdd.price +
          '원 x 1</span><div>' +
          '<button class="quantity-change ' +
          UI_CLASSES.QUANTITY_BUTTON +
          '" data-product-id="' +
          itemToAdd.id +
          '" data-change="-1">-</button>' +
          '<button class="quantity-change ' +
          UI_CLASSES.QUANTITY_BUTTON +
          '" data-product-id="' +
          itemToAdd.id +
          '" data-change="1">+</button>' +
          '<button class="remove-item ' +
          UI_CLASSES.REMOVE_BUTTON +
          '" data-product-id="' +
          itemToAdd.id +
          '">' +
          UI_TEXT.REMOVE_BUTTON +
          '</button></div>';
        cartDisplay.appendChild(newItem);
        itemToAdd.quantity--;
      }

      cartState.set({ lastSelectedProductId: selItem });
      calcCart(cartState);
    }
  });

  cartDisplay.addEventListener('click', function (event) {
    let target = event.target;
    if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
      let prodId = target.dataset.productId;
      let itemElem = document.getElementById(prodId);
      let product = productList.find((p) => p.id === prodId);

      if (target.classList.contains('quantity-change')) {
        let change = parseInt(target.dataset.change);
        let newQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]) + change;
        if (
          newQty > 0 &&
          newQty <=
            product.quantity + parseInt(itemElem.querySelector('span').textContent.split('x ')[1])
        ) {
          itemElem.querySelector('span').textContent =
            itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + newQty;
          product.quantity -= change;
        } else if (newQty <= 0) {
          itemElem.remove();
          product.quantity -= change;
        } else {
          alert(UI_TEXT.STOCK_ERROR);
        }
      } else if (target.classList.contains('remove-item')) {
        let remQty = parseInt(itemElem.querySelector('span').textContent.split('x ')[1]);
        product.quantity += remQty;
        itemElem.remove();
      }
      calcCart(cartState);
    }
  });
}

function main() {
  initializeUIElements();
  const cartState = createCartState();

  updateSelOpts();

  wrapper.appendChild(heading);
  wrapper.appendChild(cartDisplay);
  wrapper.appendChild(totalDisplay);
  wrapper.appendChild(productSelect);
  wrapper.appendChild(addButton);
  wrapper.appendChild(stockStatus);
  container.appendChild(wrapper);
  root.appendChild(container);

  calcCart(cartState);
  setupEventListeners(cartState);

  // 번개 세일 이벤트
  setTimeout(function () {
    setInterval(function () {
      let luckyItem = productList[Math.floor(Math.random() * productList.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert(`${UI_TEXT.FLASH_SALE} ${luckyItem.name}${UI_TEXT.FLASH_SALE_MESSAGE}`);
        updateSelOpts();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 상품 추천 이벤트
  setTimeout(function () {
    setInterval(function () {
      const { lastSelectedProductId } = cartState.get();
      if (lastSelectedProductId) {
        let suggest = productList.find(
          (item) => item.id !== lastSelectedProductId && item.quantity > 0,
        );
        if (suggest) {
          alert(suggest.name + UI_TEXT.RECOMMEND_MESSAGE);
          suggest.price = Math.round(suggest.price * 0.95);
          updateSelOpts();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

main();
