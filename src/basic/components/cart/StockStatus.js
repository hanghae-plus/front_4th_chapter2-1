import { productStore } from '../../stores/productStore.js';

export const StockStatus = () => {
  const { productList } = productStore.getState();
  return `<div id="stock-status" class="text-sm text-gray-500 mt-2">${productList
    .map((product) => {
      let message = '';
      if (product.quantity < 5) {
        message +=
          product.name +
          ': ' +
          (product.quantity > 0 ? '재고 부족 (' + product.quantity + '개 남음)' : '품절') +
          '\n';

        return message;
      }
    })
    .join('')}</div>`;
};
