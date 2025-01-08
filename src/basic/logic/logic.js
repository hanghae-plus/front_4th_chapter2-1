import { CartItem } from '../components/Cart.js';
import { productData } from '../data/data.js';

//함수 모음
//상품 목록 업데이트
export const updateSelectedOptions = (selectedOptions) => {
  productData.forEach(function (item) {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) option.disabled = true;
    selectedOptions.appendChild(option);
  });
};

//장바구니 계산 로직
export const calculateCart = (cartItems, sum) => {
  let totalAmount = 0;
  let itemCount = 0;
  const originalTotal = 0;
  const cartItem = cartItems.children;
  for (var i = 0; i < cartItem.length; i++) {
    (function () {
      var currentItem;
      for (var j = 0; j < productData.length; j++) {
        if (productData[j].id === cartItem[i].id) {
          currentItem = productData[j];
          break;
        }
      }
      const selectedQuantity = parseInt(
        cartItem[i].querySelector('span').textContent.split('x ')[1]
      );
      const productTotal = currentItem.price * selectedQuantity;
      let discount = 0;
      itemCount += selectedQuantity;
      originalTotal += productTotal;
      if (selectedQuantity >= 10) {
        if (currentItem.id === 'p1') discount = 0.1;
        else if (currentItem.id === 'p2') discount = 0.15;
        else if (currentItem.id === 'p3') discount = 0.2;
        else if (currentItem.id === 'p4') discount = 0.05;
        else if (currentItem.id === 'p5') discount = 0.25;
      }
      totalAmount += productTotal * (1 - discount);
    })();
  }
  let discountRate = 0;
  if (itemCount >= 30) {
    const bulkDiscount = originalTotal * 0.25;
    const itemDiscount = originalTotal - totalAmount;
    if (bulkDiscount > itemDiscount) {
      totalAmount = originalTotal * (1 - 0.25);
      discountRate = 0.25;
    } else {
      discountRate = (originalTotal - totalAmount) / originalTotal;
    }
  } else {
    discountRate = (originalTotal - totalAmount) / originalTotal;
  }
  if (new Date().getDay() === 2) {
    totalAmount *= 1 - 0.1;
    discountRate = Math.max(discountRate, 0.1);
  }
  sum.textContent = '총액: ' + Math.round(totalAmount) + '원';
  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    sum.appendChild(span);
  }
  //   updateStockInfo(stockInfo);
  renderBonusPoints(sum, totalAmount);
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
};

//번개 세일 기능 함수 호출
export const startLightningSale = (selectedOptions) => {
  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        productData[Math.floor(Math.random() * productData.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateSelectedOptions(selectedOptions);
      }
    }, 30000);
  }, Math.random() * 10000);
};

//추천 상품 기능 함수 호출
export const startRecommendProduct = (selectedOptions) => {
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
          updateSelectedOptions(selectedOptions);
        }
      }
    }, 60000);
  }, Math.random() * 20000);
};

export const handleCartItemDelete = (cartItems, productId) => {
  const itemElement = document.getElementById(productId);
  if (!itemElement) return;

  const product = productData.find((p) => p.id === productId);
  const quantity = parseInt(
    itemElement.querySelector('span').textContent.split('x ')[1]
  );

  product.quantity += quantity;
  itemElement.remove();
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
          handleCartItemDelete(cartDisplay, productId);
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (target.classList.contains('remove-item')) {
        handleCartItemDelete(cartDisplay, productId);
      }

      calculateCart(cartItems, sum);
    }
  });
};
