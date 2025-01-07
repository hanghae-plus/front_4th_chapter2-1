import { productData } from '../data/data.js';

//함수 모음
//상품 목록 업데이트
export const updateSelectedOptions = () => {
  selectedOptions.innerHTML = '';
  productData.forEach(function (item) {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) option.disabled = true;
    selectedOptions.appendChild(option);
  });
};

//장바구니 계산 로직
export const calculateCart = () => {
  totalAmount = 0;
  itemCount = 0;
  const cartItems = cartDisplay.children;
  const originalTotal = 0;
  for (var i = 0; i < cartItems.length; i++) {
    (function () {
      var currentItem;
      for (var j = 0; j < productData.length; j++) {
        if (productData[j].id === cartItems[i].id) {
          currentItem = productData[j];
          break;
        }
      }
      const selectedQuantity = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1]
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
  updateStockInfo();
  renderBonusPoints();
};

//포인트 계산 렌더링
export const renderBonusPoints = () => {
  bonusPoints = Math.floor(totalAmount / 1000);
  const loyaltyPoints = document.getElementById('loyalty-points');
  if (!loyaltyPoints) {
    const loyaltyPoints = document.createElement('span');
    loyaltyPoints.id = 'loyalty-points';
    loyaltyPoints.className = 'text-blue-500 ml-2';
    sum.appendChild(loyaltyPoints);
  }
  loyaltyPoints.textContent = '(포인트: ' + bonusPoints + ')';
};

//재고 상태 업데이트
export const updateStockInfo = () => {
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
