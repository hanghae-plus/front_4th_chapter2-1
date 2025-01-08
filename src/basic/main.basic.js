const TUESDAY = 2;
const TUESDAY_DISCOUNT = 0.1;
const BULK_DISCOUNT_THRESHOLD = 30;
const BULK_DISCOUNT_RATE = 0.25;
const LOYALTY_POINTS_THRESHOLD = 1000;
const LUCKY_SALE_RATE = 0.8; // 20% 할인
const LUCKY_SALE_PROBABILITY = 0.3;
const SUGGESTED_SALE_RATE = 0.95; // 5% 할인
const LACK_OF_STOCK = 5; // 재고 부족

const PRODUCT_DISCOUNT_AMOUNT = 10;
const PRODUCT_DISCOUNT_RATE = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};

let lastSelectedProduct;
let bonusPoints = 0;
let totalAmount = 0;
let itemCount = 0;

function main() {
  renderCartUi();
  insertProductOptions();
  calculateCart();
  eventDiscountLucky();
  eventDiscountSuggest(lastSelectedProduct);
}

function renderCartUi() {
  const $root = document.getElementById('app');
  const $container = document.createElement('div');
  const $wrap = document.createElement('div');
  const $title = document.createElement('h1');
  const $cartList = document.createElement('div');
  const $cartTotal = document.createElement('div');
  const $productSelect = document.createElement('select');
  const $addCartBtn = document.createElement('button');
  const $stockStatus = document.createElement('div');

  $cartList.id = 'cart-items';
  $cartTotal.id = 'cart-total';
  $productSelect.id = 'product-select';
  $addCartBtn.id = 'add-to-cart';
  $stockStatus.id = 'stock-status';
  $container.className = 'bg-gray-100 p-8';
  $wrap.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  $title.className = 'text-2xl font-bold mb-4';
  $cartTotal.className = 'text-xl font-bold my-4';
  $productSelect.className = 'border rounded p-2 mr-2';
  $addCartBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  $stockStatus.className = 'text-sm text-gray-500 mt-2';
  $title.textContent = '장바구니';
  $addCartBtn.textContent = '추가';

  $wrap.appendChild($title);
  $wrap.appendChild($cartList);
  $wrap.appendChild($cartTotal);
  $wrap.appendChild($productSelect);
  $wrap.appendChild($addCartBtn);
  $wrap.appendChild($stockStatus);
  $container.appendChild($wrap);
  $root.appendChild($container);
}

const PRODUCT_LIST = [
  { id: 'p1', name: '상품1', price: 10000, quantity: 50 },
  { id: 'p2', name: '상품2', price: 20000, quantity: 30 },
  { id: 'p3', name: '상품3', price: 30000, quantity: 20 },
  { id: 'p4', name: '상품4', price: 15000, quantity: 0 },
  { id: 'p5', name: '상품5', price: 25000, quantity: 10 },
];

// 상품 Select 옵션 업데이트
const insertProductOptions = () => {
  const $productSelect = document.getElementById('product-select');
  $productSelect.innerHTML = '';
  PRODUCT_LIST.forEach(function (item) {
    var option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) option.disabled = true;
    $productSelect.appendChild(option);
  });
};

// 장바구니 총액 계산
function calculateCart() {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = document.getElementById('cart-items').children;
  let subtotal = 0;
  let discountRate = 0;
  for (let i = 0; i < cartItems.length; i++) {
    const currentProduct = PRODUCT_LIST.find((product) => product.id === cartItems[i].id);

    const quantity = getItemQuantity(cartItems[i]);
    const productTotalPrice = currentProduct.price * quantity;
    itemCount += quantity;
    subtotal += productTotalPrice;
    totalAmount += productTotalPrice * (1 - matchArrayDiscountRate(currentProduct.id, quantity));
  }

  applyBulkDiscount(subtotal);

  // 할인율을 적용한 가격
  discountRate = (subtotal - totalAmount) / subtotal;

  // 화요일 할인 적용
  if (new Date().getDay() === TUESDAY) {
    totalAmount *= 1 - TUESDAY_DISCOUNT;
    discountRate = Math.max(discountRate, TUESDAY_DISCOUNT);
  }

  insertDiscountInfo(discountRate);
  updateStockInfo();
  renderBonusPoints();
}

// 상품 할인율 매치
const matchArrayDiscountRate = (productId, quantity) => {
  if (quantity >= PRODUCT_DISCOUNT_AMOUNT) {
    return PRODUCT_DISCOUNT_RATE[productId];
  } else {
    // 나머지 할인율 0
    return 0;
  }
};

// 대량구매 할인
const applyBulkDiscount = (subtotal) => {
  if (itemCount >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = subtotal * BULK_DISCOUNT_RATE;
    totalAmount = Math.min(totalAmount, subtotal - bulkDiscount);
  }
};

// 총액 표시
const insertDiscountInfo = (discountRate = 0) => {
  const $cartTotalInfo = document.getElementById('cart-total');
  $cartTotalInfo.textContent = `총액: ${Math.round(totalAmount)}원`;
  if (discountRate > 0) {
    const discountSpan = document.createElement('span');
    discountSpan.className = 'text-green-500 ml-2';
    discountSpan.textContent = `(${(discountRate * 100).toFixed(1)}% 할인 적용)`;
    $cartTotalInfo.appendChild(discountSpan);
  }
};

// 보너스 포인트 계산 및 표시
const renderBonusPoints = () => {
  // 1,000원당 포인트
  bonusPoints = Math.floor(totalAmount / LOYALTY_POINTS_THRESHOLD);
  var pointTag = document.getElementById('loyalty-points');
  if (!pointTag) {
    pointTag = document.createElement('span');
    pointTag.id = 'loyalty-points';
    pointTag.className = 'text-blue-500 ml-2';
    document.getElementById('cart-total').appendChild(pointTag);
  }
  pointTag.textContent = '(포인트: ' + bonusPoints + ')';
};

// 상품 재고 업데이트
function updateStockInfo() {
  var infoMsg = '';
  PRODUCT_LIST.forEach(function (item) {
    if (item.quantity < LACK_OF_STOCK) {
      infoMsg += item.name + ': ' + (item.quantity > 0 ? '재고 부족 (' + item.quantity + '개 남음)' : '품절') + '\n';
    }
  });
  document.getElementById('stock-status').textContent = infoMsg;
}

// 번개세일 alert
const eventDiscountLucky = () => {
  setTimeout(function () {
    setInterval(function () {
      var luckyItem = PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
      if (Math.random() < LUCKY_SALE_PROBABILITY && luckyItem.quantity > 0) {
        // 20% 할인
        luckyItem.price = Math.round(luckyItem.price * LUCKY_SALE_RATE);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);
};

// 추천세일 alert
const eventDiscountSuggest = (lastSel) => {
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        var suggest = PRODUCT_LIST.find(function (item) {
          return item.id !== lastSel && item.quantity > 0;
        });
        if (suggest) {
          // 5%할인
          alert(suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!');
          suggest.price = Math.round(suggest.price * SUGGESTED_SALE_RATE);
          updateProductOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

// 카트에 특정 상품 담긴 수량 조회
const getItemQuantity = ($target) => {
  return parseInt($target.querySelector('span').textContent.split('x ')[1]);
};

main();

// 추가버튼 클릭
document.getElementById('add-to-cart').addEventListener('click', function () {
  const selectedProduct = document.getElementById('product-select').value;
  const productToAdd = PRODUCT_LIST.find(function (product) {
    return product.id === selectedProduct;
  });

  if (productToAdd && productToAdd.quantity > 0) {
    let item = document.getElementById(productToAdd.id);
    if (item) {
      const newQty = getItemQuantity(item) + 1;
      if (newQty <= productToAdd.quantity) {
        item.querySelector('span').textContent = productToAdd.name + ' - ' + productToAdd.price + '원 x ' + newQty;
        productToAdd.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      const newItem = document.createElement('div');
      newItem.id = productToAdd.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        productToAdd.name +
        ' - ' +
        productToAdd.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        productToAdd.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        productToAdd.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        productToAdd.id +
        '">삭제</button></div>';
      document.getElementById('cart-items').appendChild(newItem);
      productToAdd.quantity--;
    }
    calculateCart();
    lastSelectedProduct = selectedProduct;
  }
});

// 장바구니 아이템 안의 버튼
document.getElementById('cart-items').addEventListener('click', function (event) {
  var target = event.target;

  // 수량 변경 또는 삭제 이벤트 처리
  if (target.classList.contains('quantity-change') || target.classList.contains('remove-item')) {
    const productId = target.dataset.productId;
    const itemElem = document.getElementById(productId);
    const productItem = PRODUCT_LIST.find((product) => product.id === productId);

    if (target.classList.contains('quantity-change')) {
      const quantityChange = parseInt(target.dataset.change);
      const currentQuantity = getItemQuantity(itemElem) + quantityChange;

      // 수량 증가 또는 감소 처리
      if (currentQuantity > 0 && currentQuantity <= productItem.quantity + getItemQuantity(itemElem)) {
        itemElem.querySelector('span').textContent =
          itemElem.querySelector('span').textContent.split('x ')[0] + 'x ' + currentQuantity;
        productItem.quantity -= quantityChange;
      } else if (currentQuantity <= 0) {
        // 수량이 0 이하일 경우 항목 삭제
        itemElem.remove();
        productItem.quantity -= quantityChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (target.classList.contains('remove-item')) {
      // 상품 삭제 처리
      const currentQuantity = getItemQuantity(itemElem);
      productItem.quantity += currentQuantity;
      itemElem.remove();
    }

    // 장바구니 총액 재계산
    calculateCart();
  }
});
