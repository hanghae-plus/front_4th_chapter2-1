import { helper } from '../../utils/helper';

const STOCK_WARNING_THRESHOLD = 5; // 재고 부족 경고 임계값

export function updateStockInfoMessage(products) {
  const infoMessage = products.reduce((message, product) => {
    if (product.quantity < STOCK_WARNING_THRESHOLD) {
      return message + helper.getWarningMessage(product.name, product.quantity);
    }
    return message;
  });

  return infoMessage;
}
