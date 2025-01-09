import { handleAddToCart, handleDecreaseQuantity, handleIncreaseQuantity, handleRemoveItem } from '../services/cart';
import {
  getAddCartButtonElement,
  getDecreaseButtonElement,
  getIncreaseButtonElement,
  getRemoveButtonElement,
} from './dom';

class EventManager {
  registerClickEventAddCartButton() {
    getAddCartButtonElement().addEventListener('click', handleAddToCart);
  }

  registerClickEventProductQuantityDecreaseButton(productId) {
    getDecreaseButtonElement(productId).addEventListener('click', () => handleDecreaseQuantity(productId));
  }

  registerClickEventProductQuantityIncreaseButton(productId, productModel) {
    getIncreaseButtonElement(productId).addEventListener('click', () =>
      handleIncreaseQuantity(productId, productModel),
    );
  }

  registerClickEventProductRemoveButton(productId) {
    getRemoveButtonElement(productId).addEventListener('click', () => handleRemoveItem(productId));
  }
}

export default new EventManager();
