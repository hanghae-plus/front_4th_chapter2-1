import { handleDecreaseQuantity, handleIncreaseQuantity, handleRemoveItem } from '../services/cart';
import { getDecreaseButtonElement, getIncreaseButtonElement, getRemoveButtonElement } from './dom';

export const setupCartItemEvents = (productId, productModel) => {
  getDecreaseButtonElement(productId).addEventListener('click', () => handleDecreaseQuantity(productId));

  getIncreaseButtonElement(productId).addEventListener('click', () => handleIncreaseQuantity(productId, productModel));

  getRemoveButtonElement(productId).addEventListener('click', () => handleRemoveItem(productId));
};
