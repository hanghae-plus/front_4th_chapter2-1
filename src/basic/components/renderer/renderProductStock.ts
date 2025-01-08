import { getStockStatus } from '../../services/getStockStatus';
import { $ } from '../../utils/dom.utils';

import type { Product } from '../../types/product.type';

export const renderProductStock = (products: Product[]) => {
  const stockStatus = getStockStatus(products);
  const stockStatusMessage = stockStatus.map((item) => `${item.name}: ${item.status}`).join('\n');

  $('#stock-status').textContent = stockStatusMessage;
};
