export const StockStatus = ({ productList }) => {
  return `<div id="stock-status" class="text-sm text-gray-500 mt-2">
    ${productList
      .map((product) => {
        if (product.stock < 5) {
          return `<div>${product.name}: ${product.stock > 0 ? '재고 부족 (' + product.stock + '개 남음)' : '품절'}</div>`;
        }
      })
      .join('')}
  </div>`;
};

export const renderStockStatus = ({ productList }) => {
  const $stockStatus = document.getElementById('stock-status');
  $stockStatus.innerHTML = StockStatus({ productList });
};
