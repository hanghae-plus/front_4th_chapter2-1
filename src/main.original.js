import {
  BULK_DISCOUNT_RATE,
  DISCOUNT_RATE,
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

// 메인 함수
function initializeShoppingCart() {
  // 요소 생성 및 설정
  var root = document.getElementById('app');
  let contents = document.createElement('div');
  var cartSection = document.createElement('div');
  let headerText = document.createElement('h1');
  cartDisplay = document.createElement('div');
  cartTotalPrice = document.createElement('div');
  productSelect = document.createElement('select');
  addCartButton = document.createElement('button');
  stockStatus = document.createElement('div');

  // 요소에 id 및 클래스 설정
  cartDisplay.id = 'cart-items';
  cartTotalPrice.id = 'cart-total';
  productSelect.id = 'product-select';
  addCartButton.id = 'add-to-cart';
  stockStatus.id = 'stock-status';

  contents.className = 'bg-gray-100 p-8';
  cartSection.className =
    'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  headerText.className = 'text-2xl font-bold mb-4';
  cartTotalPrice.className = 'text-xl font-bold my-4';
  productSelect.className = 'border rounded p-2 mr-2';
  addCartButton.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  stockStatus.className = 'text-sm text-gray-500 mt-2';

  headerText.textContent = '장바구니';
  addCartButton.textContent = '추가';
  updateProductOptions();

  // 요소 DOM에 추가
  cartSection.appendChild(headerText);
  cartSection.appendChild(cartDisplay);
  cartSection.appendChild(cartTotalPrice);
  cartSection.appendChild(productSelect);
  cartSection.appendChild(addCartButton);
  cartSection.appendChild(stockStatus);
  contents.appendChild(cartSection);
  root.appendChild(contents);

  calculateCartTotal();
  // 상품 선택 옵션 업데이트
  updateProductOptions();

  // 세일 이벤트 설정
  setTimeout(function () {
    setInterval(function () {
      var randomDiscountProduct =
        productList[Math.floor(Math.random() * productList.length)];
      if (
        Math.random() < SALE_PROBABILITY &&
        randomDiscountProduct.quantity > 0
      ) {
        randomDiscountProduct.price = Math.round(
          randomDiscountProduct.price * DISCOUNT_RATE
        );
        alert(
          '번개세일! ' +
            randomDiscountProduct.name +
            '이(가) 20% 할인 중입니다!'
        );
        updateProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);

  // 추천 상품 알림 이벤트 설정
  setTimeout(function () {
    setInterval(function () {
      if (lastSelectedProduct) {
        var recommendedProduct = productList.find(function (item) {
          return item.id !== lastSelectedProduct && item.quantity > 0;
        });
        if (recommendedProduct) {
          alert(
            recommendedProduct.name +
              '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          recommendedProduct.price = Math.round(
            recommendedProduct.price * 0.95
          );
          updateProductOptions();
        }
      }
    }, 60000);
  }, Math.random() * 20000);
}

// 상품 선택 옵션 업데이트 함수
function updateProductOptions() {
  productSelect.innerHTML = '';
  productList.forEach(function (product) {
    var productOption = document.createElement('option');
    productOption.value = product.id;
    productOption.textContent = product.name + ' - ' + product.price + '원';
    if (product.quantity === 0) productOption.disabled = true;
    productSelect.appendChild(productOption);
  });
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
        if (currentProduct.id === 'p1') discountRate = 0.1;
        else if (currentProduct.id === 'p2') discountRate = 0.15;
        else if (currentProduct.id === 'p3') discountRate = 0.2;
        else if (currentProduct.id === 'p4') discountRate = 0.05;
        else if (currentProduct.id === 'p5') discountRate = 0.25;
      }

      totalAmount += itemTotal * (1 - discountRate);
    })();
  }

  //전체 할인율
  let totalDiscountRate = 0;

  // 대량 구매 할인 적용
  if (itemCount >= 30) {
    var bulkPurchaseDiscount = totalAmount * BULK_DISCOUNT_RATE;
    var itemSpecificDiscount = subTotal - totalAmount;
    if (bulkPurchaseDiscount > itemSpecificDiscount) {
      totalAmount = subTotal * (1 - BULK_DISCOUNT_RATE);
      totalDiscountRate = BULK_DISCOUNT_RATE;
    } else {
      totalDiscountRate = (subTotal - totalAmount) / subTotal;
    }
  } else {
    totalDiscountRate = (subTotal - totalAmount) / subTotal;
  }

  // 화요일 추가 할인 적용
  if (new Date().getDay() === TUESDAY) {
    totalAmount *= 1 - 0.1;
    totalDiscountRate = Math.max(totalDiscountRate, 0.1);
  }

  // 총액 표시
  cartTotalPrice.textContent = '총액: ' + Math.round(totalAmount) + '원';

  if (totalDiscountRate > 0) {
    var span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent =
      '(' + (totalDiscountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotalPrice.appendChild(span);
  }

  updateStockStatus();
  renderBonusPoints();
}

// 보너스 포인트 렌더 함수
const renderBonusPoints = () => {
  bonusPoints = Math.floor(totalAmount / POINT_RATE);

  var loyaltyPointsElement = document.getElementById('loyalty-points');

  if (!loyaltyPointsElement) {
    loyaltyPointsElement = document.createElement('span');
    loyaltyPointsElement.id = 'loyalty-points';
    loyaltyPointsElement.className = 'text-blue-500 ml-2';
    cartTotalPrice.appendChild(loyaltyPointsElement);
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
// 추가 버튼 클릭 이벤트 핸들러
addCartButton.addEventListener('click', function () {
  var selectedProductId = productSelect.value;
  var addProduct = productList.find(function (product) {
    return product.id === selectedProductId;
  });

  if (addProduct && addProduct.quantity > 0) {
    var item = document.getElementById(addProduct.id);

    if (item) {
      var newQuantity =
        parseInt(item.querySelector('span').textContent.split('x ')[1]) + 1;

      if (newQuantity <= addProduct.quantity) {
        item.querySelector('span').textContent =
          addProduct.name + ' - ' + addProduct.price + '원 x ' + newQuantity;
        addProduct.quantity--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      var newItem = document.createElement('div');
      newItem.id = addProduct.id;
      newItem.className = 'flex justify-between items-center mb-2';
      newItem.innerHTML =
        '<span>' +
        addProduct.name +
        ' - ' +
        addProduct.price +
        '원 x 1</span><div>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        addProduct.id +
        '" data-change="-1">-</button>' +
        '<button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="' +
        addProduct.id +
        '" data-change="1">+</button>' +
        '<button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="' +
        addProduct.id +
        '">삭제</button></div>';
      cartDisplay.appendChild(newItem);
      addProduct.quantity--;
    }

    calculateCartTotal();
    lastSelectedProduct = selectedProductId;
  }
});

cartDisplay.addEventListener('click', function (event) {
  var clickedElement = event.target;

  if (
    clickedElement.classList.contains('quantity-change') ||
    clickedElement.classList.contains('remove-item')
  ) {
    var productId = clickedElement.dataset.productId;
    var cartItemElement = document.getElementById(productId);
    var product = productList.find(function (product) {
      return product.id === productId;
    });

    if (clickedElement.classList.contains('quantity-change')) {
      var quantityChange = parseInt(clickedElement.dataset.change);
      var newQuantity =
        parseInt(
          cartItemElement.querySelector('span').textContent.split('x ')[1]
        ) + quantityChange;

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
        cartItemElement.remove();
        product.quantity -= quantityChange;
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (clickedElement.classList.contains('remove-item')) {
      var removedQuantity = parseInt(
        cartItemElement.querySelector('span').textContent.split('x ')[1]
      );
      product.quantity += removedQuantity;
      cartItemElement.remove();
    }

    calculateCartTotal();
  }
});
