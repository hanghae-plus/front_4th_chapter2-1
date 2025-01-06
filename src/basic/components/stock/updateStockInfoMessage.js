import { CONSTANTS } from '../../constants';
import { helper } from '../../utils/helper';

export function updateStockInfoMessage(products) {
  const infoMessage = products.reduce((message, product) => {
    if (product.quantity < CONSTANTS.STOCK_WARNING_THRESHOLD) {
      return message + helper.getWarningMessage(product.name, product.quantity);
    }
    return message;
  });

  return infoMessage;
}
