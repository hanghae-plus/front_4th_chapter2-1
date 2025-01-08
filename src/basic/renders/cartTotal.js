const VOLUME_DISCOUNT_RATE = 0.25;

const calculateCartSummary = ({ cartItems }) => {
  let retailPrice = 0;
  let salePrice = 0;
  let totalQuantity = 0;

  cartItems.forEach((item) => {
    const { quantity, id, price } = item;

    let discountRate = 0;
    if (quantity >= 10) {
      if (id === 'p1') discountRate = 0.1;
      else if (id === 'p2') discountRate = 0.15;
      else if (id === 'p3') discountRate = 0.2;
      else if (id === 'p4') discountRate = 0.05;
      else if (id === 'p5') discountRate = 0.25;
    }

    const subtotal = price * quantity;
    retailPrice += subtotal;
    salePrice += subtotal * (1 - discountRate);
    totalQuantity += quantity;
  });

  const discountAmount = retailPrice - salePrice;
  let discountRate = 0;
  if (totalQuantity >= 30) {
    const volumeDiscountAmount = retailPrice * VOLUME_DISCOUNT_RATE;
    if (volumeDiscountAmount > discountAmount) {
      discountRate = VOLUME_DISCOUNT_RATE;
      salePrice = retailPrice * (1 - VOLUME_DISCOUNT_RATE);
    } else {
      discountRate = discountAmount / retailPrice;
    }
  } else {
    discountRate = discountAmount / retailPrice;
  }

  if (new Date().getDay() === 2) {
    discountRate = Math.max(discountRate, 0.1);
    salePrice *= 1 - 0.1;
  }

  return { retailPrice, salePrice, totalQuantity, discountRate };
};

export const renderCartTotal = ({ cartItems }) => {
  const { salePrice, discountRate } = calculateCartSummary({
    cartItems,
  });

  const $cartTotal = document.getElementById('cart-total');
  $cartTotal.textContent = '총액: ' + Math.round(salePrice) + '원';

  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    $cartTotal.appendChild(span);
  }

  const loyaltyPoint = salePrice > 0 ? Math.floor(salePrice / 1000) : 0;
  let $loyaltyPoints = document.getElementById('loyalty-points');
  if (!$loyaltyPoints) {
    $loyaltyPoints = document.createElement('span');
    $loyaltyPoints.id = 'loyalty-points';
    $loyaltyPoints.className = 'text-blue-500 ml-2';
    $cartTotal.appendChild($loyaltyPoints);
  }
  $loyaltyPoints.textContent = '(포인트: ' + loyaltyPoint + ')';
};

export const createCartTotalElement = () => {
  const $cartTotal = document.createElement('div');
  $cartTotal.id = 'cart-total';
  $cartTotal.className = 'text-xl font-bold my-4';
  return $cartTotal;
};
