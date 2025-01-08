import { productData } from '../data/data.js';

export const updateSelectedOptions = (selectedOptions) => {
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
