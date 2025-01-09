import { ProductListType, ProductType } from '../../types/ProductType';
import { helper } from '../../utils/helper';

// 재고 부족 경고 임계값
const STOCK_WARNING_THRESHOLD = 5;

// 재고 부족 여부 확인 함수
const isStockLow = (quantity: ProductType['quantity']) => quantity < STOCK_WARNING_THRESHOLD;

// 재고 정보 메시지 업데이트 함수
export const updateStockInfoMessage = (productList: ProductListType) => {
  const infoMessage = productList.reduce((message, { quantity, name }) => {
    if (!isStockLow(quantity)) {
      return message;
    }
    return `${message}${helper.getWarningMessage(name, quantity)}`;
  }, '');

  return infoMessage;
};
