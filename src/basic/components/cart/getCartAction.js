import { handleQuantityChange } from './handleQuantityChange';
import { handleRemoveItem } from './handleRemoveItem';

/**
 * 장바구니 액션 처리
 * @param {Object} element
 * @property {DOMTokenList} classList
 * @property {Object} dataset
 * @property {string} productId
 * @returns {boolean} 성공 여부
 */
export function handleCartAction({
  classList,
  dataset: { productId, change },
}) {
  // 수량 변경
  if (classList.contains('quantity-change')) {
    const changedQuantity = parseInt(change);
    return handleQuantityChange(productId, changedQuantity);
  }

  // 상품 삭제
  if (classList.contains('remove-item')) {
    return handleRemoveItem(productId);
  }

  return false;
}
