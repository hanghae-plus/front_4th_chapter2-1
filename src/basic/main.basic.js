import Header from './components/Header';

// 할인율
const DISCOUNT_RATES = {
  p1: 0.1,
  p2: 0.15,
  p3: 0.2,
  p4: 0.05,
  p5: 0.25,
};
const BULK_DISCOUNT_RATE = 0.25; // 대량 구매 할인율
const WEEKLY_DISCOUNT_DAY = 2; // 화요일
const WEEKLY_DISCOUNT_RATE = 0.1; // 요일별 할인율
const RANDOM_SALE_RATE = 0.3; // 랜덤 세일 확률
const LIGHTNING_SALE_RATE = 0.8; // 번개세일 할인율
const SUGGESTION_DISCOUNT_RATE = 0.95; // 추천 상품 할인율

// 수량
const BULK_DISCOUNT_THRESHOLD = 30; // 총 구매 수량 30개 이상일 경우 대량 구매 할인
const QUANTITY_THRESHOLD = 10; // 할인 적용 최소 수량
const STOCK_WARNING_THRESHOLD = 5; // 재고 부족 경고 임계값

// 포인트
const LOYALTY_POINTS_RATE = 1_000; // 1000원당 1포인트 적립

// 시간
const LIGHTNING_SALE_INTERVAL = 30_000; // 30초마다 번개세일
const LIGHTNING_SALE_DELAY = 10_000; // 번개세일 초기 지연
const SUGGESTION_INTERVAL = 60_000; // 60초마다 추천 알림
const SUGGESTION_DELAY = 20_000; // 추천 알림 초기 지연

// 메시지
const getLightningSaleMessage = name =>
  `번개세일! ${name}이(가) 20% 할인 중입니다!`;
const getSuggestionMessage = name =>
  `${name}은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!`;
const getNameAndPriceMessage = (name, price) => `${name} - ${price}원`;
const getTotalAmountMessage = amount => `총액: ${amount}원`;
const getDiscountedAmountMessage = amount => `(${amount}% 할인 적용)`;
const getWarningMessage = (name, quantity) =>
  `${name}: ${quantity > 0 ? '재고 부족 (' + quantity + '개 남음)' : '품절'}\n`;
const OUT_OF_STOCK_MESSAGE = '재고가 부족합니다.';

let products,
  productSelector,
  addToCartButton,
  cartDisplay,
  totalDisplay,
  stockInfo,
  lastSelectedItem;
let bonusPoints = 0,
  totalAmount = 0,
  itemCount = 0;

function main() {
  products = [
    { id: 'p1', name: '상품1', price: 10_000, quantity: 50 },
    { id: 'p2', name: '상품2', price: 20_000, quantity: 30 },
    { id: 'p3', name: '상품3', price: 30_000, quantity: 20 },
    { id: 'p4', name: '상품4', price: 15_000, quantity: 0 },
    { id: 'p5', name: '상품5', price: 25_000, quantity: 10 },
  ];

  const root = document.getElementById('app');
  const containerDiv = document.createElement('div');
  const contentWrapper = document.createElement('div');

  cartDisplay = document.createElement('div');
  totalDisplay = document.createElement('div');
  productSelector = document.createElement('select');
  addToCartButton = document.createElement('button');
  stockInfo = document.createElement('div');

  cartDisplay.id = 'cart-items';
  totalDisplay.id = 'cart-total';
  productSelector.id = 'product-select';
  addToCartButton.id = 'add-to-cart';
  stockInfo.id = 'stock-status';

  containerDiv.className = 'bg-gray-100 p-8';
  contentWrapper.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';

  totalDisplay.className = 'text-xl font-bold my-4';
  productSelector.className = 'border rounded p-2 mr-2';
  addToCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockInfo.className = 'text-sm text-gray-500 mt-2';

  addToCartButton.textContent = '추가';

  updateSelectOptions();

  const header = Header({ title: '장바구니' });
  contentWrapper.appendChild(header);
  contentWrapper.appendChild(cartDisplay);
  contentWrapper.appendChild(totalDisplay);
  contentWrapper.appendChild(productSelector);
  contentWrapper.appendChild(addToCartButton);
  contentWrapper.appendChild(stockInfo);
  containerDiv.appendChild(contentWrapper);
  root.appendChild(containerDiv);

  calculateCart();

  setTimeout(function () {
    setInterval(function () {
      const luckyItem = products[Math.floor(Math.random() * products.length)];

      if (Math.random() < RANDOM_SALE_RATE && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * LIGHTNING_SALE_RATE);
        alert(getLightningSaleMessage(luckyItem.name));
        updateSelectOptions();
      }
    }, LIGHTNING_SALE_INTERVAL);
  }, Math.random() * LIGHTNING_SALE_DELAY);

  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedItem) {
        const suggest = products.find(function (item) {
          return item.id !== lastSelectedItem && item.quantity > 0;
        });

        if (suggest) {
          alert(getSuggestionMessage(suggest.name));
          suggest.price = Math.round(suggest.price * SUGGESTION_DISCOUNT_RATE);
          updateSelectOptions();
        }
      }
    }, SUGGESTION_INTERVAL);
  }, Math.random() * SUGGESTION_DELAY);
}

function updateSelectOptions() {
  productSelector.innerHTML = '';
  products.forEach(function (item) {
    const selectOption = document.createElement('option');

    selectOption.value = item.id;
    selectOption.textContent = getNameAndPriceMessage(item.name, item.price);
    if (item.quantity === 0) selectOption.disabled = true;

    productSelector.appendChild(selectOption);
  });
}

function calculateCart() {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = cartDisplay.children;
  let preDiscountTotal = 0; // 할인 적용 전 총액

  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentProduct;
      for (let j = 0; j < products.length; j++) {
        if (products[j].id === cartItems[i].id) {
          currentProduct = products[j];
          break;
        }
      }

      const quantity = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      const currentProductAmount = currentProduct.price * quantity;

      let discountRate = 0;
      itemCount += quantity;
      preDiscountTotal += currentProductAmount;

      if (quantity >= QUANTITY_THRESHOLD && DISCOUNT_RATES[currentProduct.id]) {
        discountRate = DISCOUNT_RATES[currentProduct.id];
      }
      totalAmount += currentProductAmount * (1 - discountRate);
    })();
  }

  let overallDiscountRate = 0;
  if (itemCount >= BULK_DISCOUNT_THRESHOLD) {
    const bulkDiscount = totalAmount * BULK_DISCOUNT_RATE;
    const itemDiscount = preDiscountTotal - totalAmount;

    if (bulkDiscount > itemDiscount) {
      totalAmount = preDiscountTotal * (1 - BULK_DISCOUNT_RATE);
      overallDiscountRate = BULK_DISCOUNT_RATE;
    } else {
      overallDiscountRate = (preDiscountTotal - totalAmount) / preDiscountTotal;
    }
  } else {
    overallDiscountRate = (preDiscountTotal - totalAmount) / preDiscountTotal;
  }

  if (new Date().getDay() === WEEKLY_DISCOUNT_DAY) {
    totalAmount *= 1 - WEEKLY_DISCOUNT_RATE;
    overallDiscountRate = Math.max(overallDiscountRate, WEEKLY_DISCOUNT_RATE);
  }

  const roundedAmount = Math.round(totalAmount);
  totalDisplay.textContent = getTotalAmountMessage(roundedAmount);

  if (overallDiscountRate > 0) {
    const discountSpan = document.createElement('span');
    discountSpan.className = 'text-green-500 ml-2';
    const discountedAmount = (overallDiscountRate * 100).toFixed(1);
    discountSpan.textContent = getDiscountedAmountMessage(discountedAmount);
    totalDisplay.appendChild(discountSpan);
  }

  updateStockInfo();
  renderBonusPts();
}

const renderBonusPts = () => {
  bonusPoints = Math.floor(totalAmount / LOYALTY_POINTS_RATE);

  let pointsTag = document.getElementById('loyalty-points');
  if (!pointsTag) {
    pointsTag = document.createElement('span');
    pointsTag.id = 'loyalty-points';
    pointsTag.className = 'text-blue-500 ml-2';
    totalDisplay.appendChild(pointsTag);
  }
  pointsTag.textContent = '(포인트: ' + bonusPoints + ')';
};

function updateStockInfo() {
  let infoMessage = '';
  products.forEach(function (product) {
    if (product.quantity < STOCK_WARNING_THRESHOLD) {
      infoMessage += getWarningMessage(product.name, product.quantity);
    }
  });
  stockInfo.textContent = infoMessage;
}

main();

addToCartButton.addEventListener('click', function () {
  const selectedItem = productSelector.value;
  const productToAdd = products.find(function (p) {
    return p.id === selectedItem;
  });

  if (productToAdd && productToAdd.quantity > 0) {
    const product = document.getElementById(productToAdd.id);

    if (product) {
      const newQuantity =
        parseInt(product.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQuantity <= productToAdd.quantity) {
        product.querySelector('span').textContent =
          productToAdd.name +
          ' - ' +
          productToAdd.price +
          '원 x ' +
          newQuantity;
        productToAdd.quantity--;
      } else {
        alert(OUT_OF_STOCK_MESSAGE);
      }
    } else {
      const newProduct = document.createElement('div');
      newProduct.id = productToAdd.id;
      newProduct.className = 'flex justify-between items-center mb-2';
      newProduct.innerHTML =
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

      cartDisplay.appendChild(newProduct);
      productToAdd.quantity--;
    }

    calculateCart();
    lastSelectedItem = selectedItem;
  }
});

cartDisplay.addEventListener('click', function (event) {
  const targetElement = event.target;
  if (
    targetElement.classList.contains('quantity-change') ||
    targetElement.classList.contains('remove-item')
  ) {
    const productId = targetElement.dataset.productId;
    const cartProductElement = document.getElementById(productId);
    const selectedProduct = products.find(function (product) {
      return product.id === productId;
    });

    if (targetElement.classList.contains('quantity-change')) {
      const quantityChange = parseInt(targetElement.dataset.change);
      const newQuantity =
        parseInt(
          cartProductElement.querySelector('span').textContent.split('x ')[1],
        ) + quantityChange;

      if (
        newQuantity > 0 &&
        newQuantity <=
          selectedProduct.quantity +
            parseInt(
              cartProductElement
                .querySelector('span')
                .textContent.split('x ')[1],
            )
      ) {
        cartProductElement.querySelector('span').textContent =
          cartProductElement.querySelector('span').textContent.split('x ')[0] +
          'x ' +
          newQuantity;
        selectedProduct.quantity -= quantityChange;
      } else if (newQuantity <= 0) {
        cartProductElement.remove();
        selectedProduct.quantity -= quantityChange;
      } else {
        alert(OUT_OF_STOCK_MESSAGE);
      }
    } else if (targetElement.classList.contains('remove-item')) {
      const removedQuantity = parseInt(
        cartProductElement.querySelector('span').textContent.split('x ')[1],
      );
      selectedProduct.quantity += removedQuantity;
      cartProductElement.remove();
    }

    calculateCart();
  }
});
