export function createProductStockInfo() {
  const productStockInfo = document.createElement('div');
  productStockInfo.id = 'stock-status';
  productStockInfo.className = 'text-sm text-gray-500 mt-2';
  return productStockInfo;
}
