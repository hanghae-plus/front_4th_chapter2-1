export const renderStockStatus = ({ productList }) => {
  const $stockStatus = document.getElementById('stock-status');

  let infoMsg = '';
  productList.forEach(function (item) {
    if (item.stock < 5) {
      infoMsg +=
        item.name +
        ': ' +
        (item.stock > 0 ? '재고 부족 (' + item.stock + '개 남음)' : '품절') +
        '\n';
    }
  });

  $stockStatus.textContent = infoMsg;
};

export const createStockStatusElement = () => {
  const $stockStatus = document.createElement('div');
  $stockStatus.id = 'stock-status';
  $stockStatus.className = 'text-sm text-gray-500 mt-2';
  return $stockStatus;
};
