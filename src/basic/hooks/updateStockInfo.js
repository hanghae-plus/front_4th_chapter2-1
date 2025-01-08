import { productList } from '../data/productList.js';
import { productStockInfo } from '../main.basic.js';

export function updateStockInfo() {
  let infoMessage = '';

  productList.forEach(function (item) {
    if (getLastCount() < 5) {
      infoMessage +=
        item.name +
        ': ' +
        (item.quantity > 0
          ? '재고 부족 (' + item.quantity + '개 남음)'
          : '품절') +
        '\n';
    }
  });
  productStockInfo.textContent = infoMessage;
}
