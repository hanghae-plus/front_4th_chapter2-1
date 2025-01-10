import { productData } from '../data/data.js';

//상품 데이터 초기화
export const initSelectableData = (selectedOptions) => {
  updateStockInfo();
  productData.forEach(function (item) {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.name + ' - ' + item.price + '원';
    if (item.quantity === 0) option.disabled = true;
    selectedOptions.appendChild(option);
  });
};

//재고 상태 업데이트
export const updateStockInfo = () => {
  let infoMessage = '';
  const stockStatus = document.getElementById('stock-status');
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
  stockStatus.textContent = infoMessage;
};
