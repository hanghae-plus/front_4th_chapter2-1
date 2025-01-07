import { ProductStore } from '../../store/productStore';

/**
 * 제품 삭제 이벤트 핸들러
 * @param {*} productId
 * @returns {boolean} 성공 여부
 */
export function handleRemoveItem(productId) {
  const cartProductElement = document.getElementById(productId);
  const productStore = ProductStore.getInstance();
  const selectedProduct = productStore.findProduct(productId);

  const removedQuantity = parseInt(
    cartProductElement.querySelector('span').textContent.split('x ')[1],
  );
  productStore.updateProductQuantity(selectedProduct.id, removedQuantity);
  cartProductElement.remove();

  return true;
}
