import { ProductListType, ProductType } from 'src/advanced/types/ProductType';

// 재고 부족 경고 임계값
const STOCK_WARNING_THRESHOLD = 5;

// 재고 부족 여부 확인 함수
const isStockLow = (quantity: ProductType['quantity']) => quantity < STOCK_WARNING_THRESHOLD;
const hasStock = (quantity: ProductType['quantity']) => quantity > 0;

// 재고 정보 메시지 업데이트 함수
export const updateStockInfoMessage = (productList: ProductListType) => {
  const infoMessage = productList.reduce((message, { quantity, name }) => {
    if (!isStockLow(quantity)) {
      return message;
    }
    return `${message}${name}: ${hasStock(quantity) ? `재고 부족 (${quantity}개 남음)` : '품절'}\n`;
  }, '');

  return infoMessage;
};
