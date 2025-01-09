import { getProductItemElement } from '../utils/dom';
import eventManager from '../utils/events';

const CartItem = ({ id, name, price, quantity }) => /* html */ `
  <div id="${id}" class="flex justify-between items-center mb-2">
    <span>${name} - ${price}원 x ${quantity}</span>
    <div>
      <button 
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
        data-product-id="${id}" 
        data-event-type="decrease"
        data-change="-1"
      >-</button>
      
      <button 
        class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" 
        data-product-id="${id}" 
        data-event-type="increase"
        data-change="1"
      >+</button>

      <button 
        class="remove-item bg-red-500 text-white px-2 py-1 rounded" 
        data-product-id="${id}"
        data-event-type="remove"
      >삭제</button>
    </div>
  </div>
`;

export default CartItem;

export const updateCartItem = (productId, cartItem) => {
  const container = document.createElement('div');
  container.innerHTML = CartItem(cartItem);

  const oldElement = getProductItemElement(productId);
  oldElement.replaceWith(container.firstElementChild);

  eventManager.registerClickEventProductQuantityDecreaseButton(productId);
  eventManager.registerClickEventProductQuantityIncreaseButton(productId, cartItem);
  eventManager.registerClickEventProductRemoveButton(productId);
};
