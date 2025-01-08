import { productList } from '../data/productList.js';
import { updateStockInfo } from './updateStockInfo.js';
import {
  cartDisplay,
  cartTotal,
  getItemCount,
  getTotalAmount,
  setItemCount,
  setTotalAmount,
} from '../main.basic.js';
import { updateBonusPoints } from './updateBonusPoints.js';

export function calculateCartSummary() {
  const cartItems = cartDisplay.children;
  let subTotal = 0;
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let currentItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          currentItem = productList[j];
          break;
        }
      }
      const quantity = parseInt(
        cartItems[i].querySelector('span').textContent.split('x ')[1],
      );
      const itemTotal = currentItem.price * quantity;
      let discount = 0;
      setItemCount((prevItemCount) => prevItemCount + quantity);
      subTotal += itemTotal;
      if (quantity >= 10) {
        if (currentItem.id === 'p1') discount = 0.1;
        else if (currentItem.id === 'p2') discount = 0.15;
        else if (currentItem.id === 'p3') discount = 0.2;
        else if (currentItem.id === 'p4') discount = 0.05;
        else if (currentItem.id === 'p5') discount = 0.25;
      }
      setTotalAmount(
        (prevTotalAmount) => prevTotalAmount + itemTotal * (1 - discount),
      );
    })();
  }
  let discountRate = 0;
  if (getItemCount() >= 30) {
    const bulkDiscount = getTotalAmount() * 0.25;
    const itemDiscount = subTotal - getTotalAmount();
    if (bulkDiscount > itemDiscount) {
      setTotalAmount(subTotal * (1 - 0.25));
      discountRate = 0.25;
    } else {
      discountRate = (subTotal - getTotalAmount()) / subTotal;
    }
  } else {
    discountRate = (subTotal - getTotalAmount()) / subTotal;
  }
  if (new Date().getDay() === 2) {
    setTotalAmount((prevTotalAmount) => prevTotalAmount * (1 - 0.1));
    discountRate = Math.max(discountRate, 0.1);
  }
  cartTotal.textContent = '총액: ' + Math.round(getTotalAmount()) + '원';
  if (discountRate > 0) {
    const span = document.createElement('span');
    span.className = 'text-green-500 ml-2';
    span.textContent = '(' + (discountRate * 100).toFixed(1) + '% 할인 적용)';
    cartTotal.appendChild(span);
  }
  updateStockInfo();
  updateBonusPoints();
}
