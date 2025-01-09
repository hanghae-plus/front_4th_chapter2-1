import {
  BULK_DISCOUNT_RATE,
  discountRates,
  POINT_RATE,
  productList,
  TUESDAY,
} from '../constant/product';
import { createChildElement, createStyledElement } from './element-util';

export function cartService() {
  // 장바구니 총액 계산 함수
  function calculateCartTotal(cart) {
    cart.totalAmount = 0;
    cart.itemCount = 0;

    const cartItems = Array.from(cart.cartDisplay.children);
    let subTotal = 0;

    cartItems.forEach((item) => {
      const currentProduct = productList.find(
        (product) => product.id === item.id
      );
      const cartItemQuantity = parseInt(
        item.querySelector('span').textContent.split('x ')[1]
      );

      const itemTotal = currentProduct.price * cartItemQuantity;
      let discountRate = 0;
      cart.itemCount += cartItemQuantity;
      subTotal += itemTotal;

      if (cartItemQuantity >= 10) {
        discountRate = discountRates[currentProduct.id];
      }

      cart.totalAmount += itemTotal * (1 - discountRate);
    });

    const totalDiscountRate = calculateDiscountRate(subTotal, cart);

    const { totalAmount: finalAmount, totalDiscountRate: finalDiscountRate } =
      applyWeeklyDiscount(cart.totalAmount, totalDiscountRate);

    cart.cartTotalPrice.textContent = '총액: ' + Math.round(finalAmount) + '원';

    if (finalDiscountRate > 0) {
      const span = createStyledElement({
        tag: 'span',
        className: 'text-green-500 ml-2',
        textContent:
          '(' + (finalDiscountRate * 100).toFixed(1) + '% 할인 적용)',
      });

      createChildElement(cart.cartTotalPrice, span);
    }

    updateStockStatus(cart);
    renderBonusPoints(cart);
  }

  // 대량 구매 할인 적용 함수
  function calculateDiscountRate(subTotal, cart) {
    if (cart.itemCount >= 30) {
      const bulkPurchaseDiscount = cart.totalAmount * BULK_DISCOUNT_RATE;
      const itemSpecificDiscount = subTotal - cart.totalAmount;
      if (bulkPurchaseDiscount > itemSpecificDiscount) {
        cart.totalAmount = subTotal * (1 - BULK_DISCOUNT_RATE);
        return BULK_DISCOUNT_RATE;
      }
      return (subTotal - cart.totalAmount) / subTotal;
    }
    return (subTotal - cart.totalAmount) / subTotal;
  }

  // 화요일 추가 할인 적용 함수
  function applyWeeklyDiscount(cartAmount, totalDiscountRate) {
    if (new Date().getDay() === TUESDAY) {
      cartAmount *= 1 - 0.1;
      totalDiscountRate = Math.max(totalDiscountRate, 0.1);
    }
    return { totalAmount: cartAmount, totalDiscountRate };
  }

  // 보너스 포인트 렌더 함수
  function renderBonusPoints(cart) {
    cart.bonusPoints = Math.floor(cart.totalAmount / POINT_RATE);
    let loyaltyPointsElement = document.getElementById('loyalty-points');

    if (!loyaltyPointsElement) {
      loyaltyPointsElement = createStyledElement({
        tag: 'span',
        id: 'loyalty-points',
        className: 'text-blue-500 ml-2',
      });
      createChildElement(cart.cartTotalPrice, loyaltyPointsElement);
    }

    loyaltyPointsElement.textContent = '(포인트: ' + cart.bonusPoints + ')';
  }

  // 재고 상태 업데이트 함수
  function updateStockStatus(cart) {
    let stockStatusMessage = '';

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

    cart.stockStatus.textContent = stockStatusMessage;
  }

  // 장바구니에 제품을 추가하는 함수
  function addCartProduct(cart, product) {
    const existingItem = document.getElementById(product.id);

    if (existingItem) {
      updateCartProductQuantity(existingItem, cart, product);
    } else {
      addNewCartProduct(cart, product);
    }
    calculateCartTotal(cart);
  }

  // 장바구니에 있는 제품의 수량을 업데이트하는 함수
  function updateCartProductQuantity(existingItem, cart, product) {
    const quantityElement = existingItem.querySelector('span');
    const newQuantity =
      parseInt(quantityElement.textContent.split('x ')[1]) + 1;

    if (newQuantity <= product.quantity) {
      quantityElement.textContent = `${product.name} - ${product.price}원 x ${newQuantity}`;
      product.quantity--;
      return;
    }

    alert('재고가 부족합니다.');
  }

  // 장바구니에 새로운 제품을 추가하는 함수
  function addNewCartProduct(cart, product) {
    const newItem = createStyledElement({
      tag: 'div',
      id: product.id,
      className: 'flex justify-between items-center mb-2',
      innerHTML: `
        <span>${product.name} - ${product.price}원 x 1</span>
        <div>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="-1">-</button>
          <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id="${product.id}" data-change="1">+</button>
          <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id="${product.id}">삭제</button>
        </div>
      `,
    });
    createChildElement(cart.cartDisplay, newItem);
    product.quantity--;
  }

  function updateCartTotal(cart) {
    const totalAmount = cart.totalAmount;
    const bonusPoints = cart.bonusPoints;
    cart.cartTotalPrice.textContent = `Total: ${totalAmount}원 (Bonus: ${bonusPoints} Points)`;
  }

  return { updateCartTotal, addCartProduct, calculateCartTotal };
}
