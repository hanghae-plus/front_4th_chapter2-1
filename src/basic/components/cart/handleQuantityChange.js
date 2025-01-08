import { OUT_OF_STOCK_MESSAGE } from '../../constants';
import { ProductStore } from '../../store/productStore';
import { updateCartItemQuantity } from '../cartAddButton/cartItem/updateCartItemQuantity';

/**
 * 수량 변경에 따른 UI 업데이트
 * @param {*} productId
 * @param {*} changedQuantity
 * @returns {boolean} 성공 여부
 */
export function handleQuantityChange(productId, changedQuantity) {
  const cartProductElement = document.getElementById(productId);
  const productStore = ProductStore.getInstance();
  const selectedProduct = productStore.findProduct(productId);

  const quantity = parseInt(
    cartProductElement.querySelector('span').textContent.split('x ')[1],
  );
  const newQuantity = quantity + changedQuantity;

  // UI 업데이트 및 상태 변경
  if (newQuantity > 0 && newQuantity <= selectedProduct.quantity + quantity) {
    updateCartItemQuantity(cartProductElement, selectedProduct, newQuantity);
    productStore.updateProductQuantity(selectedProduct.id, -changedQuantity);
    return true;
  }

  // 수량이 0 이하가 되는 경우 상품 제거
  if (newQuantity <= 0) {
    cartProductElement.remove();
    productStore.updateProductQuantity(selectedProduct.id, -changedQuantity);
    return true;
  }

  // 재고 부족 알림
  alert(OUT_OF_STOCK_MESSAGE);
  return false;
}
