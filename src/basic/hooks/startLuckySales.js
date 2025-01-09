import { PRODUCT_LIST } from '../const/constance.js';
import { updateProductOptions } from './updateProductOptions.js';

export function startLuckySales() {
  setTimeout(function () {
    setInterval(function () {
      const luckyItem =
        PRODUCT_LIST[Math.floor(Math.random() * PRODUCT_LIST.length)];
      if (Math.random() < 0.3 && luckyItem.quantity > 0) {
        luckyItem.price = Math.round(luckyItem.price * 0.8);
        alert('번개세일! ' + luckyItem.name + '이(가) 20% 할인 중입니다!');
        updateProductOptions();
      }
    }, 30000);
  }, Math.random() * 10000);
}
