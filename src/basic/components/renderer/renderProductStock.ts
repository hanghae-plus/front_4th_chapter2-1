import { products } from '../../data/product';
import { getStockStatus } from '../../services/getStockStatus';
import { $ } from '../../utils/dom.utils';

export const renderProductStock = () => {
  const stockStatus = getStockStatus(products);
  const stockStatusMessage = stockStatus.map((item) => `${item.name}: ${item.status}`).join('\n');

  $('#stock-status').textContent = stockStatusMessage;
};
