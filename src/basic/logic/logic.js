import { CartItem } from '../components/Cart.js';
import { productData } from '../data/data.js';

//함수 모음
//상품 목록 업데이트
export const updateSelectedOptions = (selectedOptions) => {
  //stock-status 업데이트
  const stockStatus = document.getElementById('stock-status');
  updateStockInfo(stockStatus);
  productData.forEach(function (item) {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) option.disabled = true;
    selectedOptions.appendChild(option);
  });
};

// 할인율 계산
const calculateDiscounts = (items) => {
  const result = {
    totalAmount: 0,
    originalTotal: 0,
    itemCount: 0,
    discountRate: 0
  };

  // 개별 상품 계산
  items.forEach(({ item, selectedQuantity }) => {
    const productTotal = item.price * selectedQuantity;

    result.itemCount += selectedQuantity;
    result.originalTotal += productTotal;

    // 수량 할인 계산
    let discount = 0;
    if (selectedQuantity >= 10) {
      const discountRates = {
        p1: 0.1,
        p2: 0.15,
        p3: 0.2,
        p4: 0.05,
        p5: 0.25
      };
      discount = discountRates[item.id] || 0;
    }
    result.totalAmount += productTotal * (1 - discount);
    result.discountRate = discount;
  });

  // 대량 구매 할인 적용
  if (result.itemCount >= 30) {
    const bulkDiscount = result.originalTotal * 0.25;
    const itemDiscount = result.originalTotal - result.totalAmount;

    if (bulkDiscount > itemDiscount) {
      result.totalAmount = result.originalTotal * 0.75;
      result.discountRate = 0.25;
    } else {
      result.discountRate =
        (result.originalTotal - result.totalAmount) / result.originalTotal;
    }
  }

  // 화요일 할인 적용
  if (new Date().getDay() === 2) {
    result.totalAmount *= 0.9;
    result.discountRate = Math.max(result.discountRate, 0.1);
  }

  return result;
};

// UI 렌더링과 연동되는 부분
export const calculateCart = () => {
  const cartItems = document.getElementById('cart-items');
  const totalSum = document.getElementById('cart-total');
  // DOM에서 필요한 데이터 추출
  const items = Array.from(cartItems.children)
    .map((cartItem) => {
      const item = productData.find((p) => p.id === cartItem.id);
      if (!item) return null;

      const selectedQuantity = parseInt(
        cartItem.querySelector('span').textContent.split('x ')[1]
      );
      return { item, selectedQuantity };
    })
    .filter(Boolean);

  // 계산 로직 실행
  const result = calculateDiscounts(items);

  // UI 업데이트
  totalSum.textContent = `총액: ${Math.round(result.totalAmount)}원`;

  if (result.discountRate > 0) {
    const discountSpan = document.createElement('span');
    discountSpan.className = 'text-green-500 ml-2';
    discountSpan.textContent = `(${(result.discountRate * 100).toFixed(
      1
    )}% 할인 적용)`;
    totalSum.appendChild(discountSpan);
  }

  renderBonusPoints(totalSum, result.totalAmount);
};

//포인트 계산 렌더링
export const renderBonusPoints = (sum, totalAmount) => {
  const bonusPoints = Math.floor(totalAmount / 1000);
  let loyaltyPoints = document.getElementById('loyalty-points');
  if (!loyaltyPoints) {
    loyaltyPoints = document.createElement('span');
    loyaltyPoints.id = 'loyalty-points';
    loyaltyPoints.className = 'text-blue-500 ml-2';
    sum.appendChild(loyaltyPoints);
  }
  loyaltyPoints.textContent = '(포인트: ' + bonusPoints + ')';
};

//재고 상태 업데이트
export const updateStockInfo = (stockInfo) => {
  let infoMessage = '';
  productData.forEach(function (item) {
    if (item.quantity < 5) {
      infoMessage +=
        item.name +
        ': ' +
        (item.quantity > 0
          ? '재고 부족 (' + item.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  stockInfo.textContent = infoMessage;
};

//상품 추가 기능
export const addToCart = (cartItems, selectedOptions) => {
  const selectedItem = selectedOptions.value;
  const itemToAdd = productData.find((p) => p.id === selectedItem);

  try {
    if (itemToAdd && itemToAdd.quantity > 0) {
      let existingItem = document.getElementById(itemToAdd.id);

      if (existingItem) {
        // 이미 장바구니에 있는 상품인 경우
        const newQty =
          parseInt(
            existingItem.querySelector('span').textContent.split('x ')[1]
          ) + 1;
        if (newQty <= itemToAdd.quantity) {
          existingItem.querySelector(
            'span'
          ).textContent = `${itemToAdd.name} - ${itemToAdd.price}원 x ${newQty}`;
          itemToAdd.quantity--;
        } else {
          alert('재고가 부족합니다.');
        }
      } else {
        // 새로운 상품 추가
        const newItem = CartItem(itemToAdd);
        cartItems.appendChild(newItem);
        itemToAdd.quantity--;
      }
      return true;
    }

    return false;
  } finally {
    calculateCart();
  }
};

//번개 세일 기능 함수 호출
export const startLightningSale = () => {
  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        productData[Math.floor(Math.random() * productData.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
      }
    }, 30000);
  }, Math.random() * 10000);
};

//추천 상품 기능 함수 호출
export const startRecommendProduct = () => {
  setTimeout(function () {
    setInterval(function () {
      if (lastSel) {
        const suggest = productData.find(function (item) {
          return item.id !== lastSel && item.quantity > 0;
        });
        if (suggest) {
          alert(
            suggest.name + '은(는) 어떠세요? 지금 구매하시면 5% 추가 할인!'
          );
          suggest.price = Math.round(suggest.price * 0.95);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

export const handleCartItemDelete = (productId) => {
  const itemElement = document.getElementById(productId);
  if (!itemElement) return;

  const product = productData.find((p) => p.id === productId);
  const quantity = parseInt(
    itemElement.querySelector('span').textContent.split('x ')[1]
  );

  product.quantity += quantity;
  itemElement.remove();
  calculateCart();
};

export const initializeCartEvents = (cartItems, sum) => {
  cartItems.addEventListener('click', (event) => {
    const target = event.target;

    if (
      target.classList.contains('quantity-change') ||
      target.classList.contains('remove-item')
    ) {
      const productId = target.dataset.productId;

      if (target.classList.contains('quantity-change')) {
        const quantityChange = parseInt(target.dataset.change);
        const itemElement = document.getElementById(productId);
        const product = productData.find((p) => p.id === productId);

        const currentQuantity = parseInt(
          itemElement.querySelector('span').textContent.split('x ')[1]
        );
        const newQuantity = currentQuantity + quantityChange;

        if (
          newQuantity > 0 &&
          newQuantity <= product.quantity + currentQuantity
        ) {
          itemElement.querySelector(
            'span'
          ).textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
          product.quantity -= quantityChange;
        } else if (newQuantity <= 0) {
          handleCartItemDelete(productId);
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (target.classList.contains('remove-item')) {
        handleCartItemDelete(productId);
      }
    }
  });
};

export const updateCartItemQuantity = (itemId, isIncrease) => {
  const cartItem = document.getElementById(itemId);
  if (!cartItem) return;

  const quantityDisplay = cartItem.querySelector('span');
  const currentQuantity = parseInt(quantityDisplay.textContent.split('x ')[1]);

  const product = productData.find((p) => p.id === itemId);
  if (!product) return;

  // 재고 관� 체크
  if (isIncrease) {
    if (product.quantity <= 0) {
      alert('재고가 부족합니다.');
      return;
    }
  }

  const newQuantity = isIncrease ? currentQuantity + 1 : currentQuantity - 1;
  const stockInfo = document.getElementById('stock-status');
  if (newQuantity > 0) {
    if (isIncrease) {
      product.quantity--;
      updateStockInfo(stockInfo);
    } else {
      product.quantity++;
      updateStockInfo(stockInfo);
    }

    quantityDisplay.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
  }
  calculateCart();
};
