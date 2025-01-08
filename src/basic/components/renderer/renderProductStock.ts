import { products } from '../../data/product';
import { $ } from '../../utils/dom.utils';

export const renderProductStock = () => {
  let stockStatusMessage = '';

  products.forEach((item) => {
    if (item.quantity < 5) {
      stockStatusMessage += `${item.name}: ${
        item.quantity > 0 ? `재고 부족 (${item.quantity}개 남음)` : '품절'
      }\n`;
    }
  });
  $('#stock-status').textContent = stockStatusMessage;
};
