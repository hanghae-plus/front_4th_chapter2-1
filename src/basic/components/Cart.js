import { createElement } from '../core/createElement.js';
import { addToCart, handleCartItemDelete } from '../logic/cartLogic.js';
import { updateCartItemQuantity } from '../logic/cartLogic.js';

export const CartTitle = () => {
  return createElement('h1', {
    className: 'text-2xl font-bold mb-4',
    textContent: '장바구니'
  });
};

export const CartItems = () => {
  return createElement('div', {
    id: 'cart-items'
  });
};

//장바구니 상품
export const CartItem = (itemToAdd) => {
  const itemSpan = createElement('span', {
    textContent: `${itemToAdd.name} - ${itemToAdd.price}원 x 1`
  });

  const buttonContainer = createElement('div', {});

  const minusButton = QuantityChangeButton(itemToAdd.id, false, '-');
  const plusButton = QuantityChangeButton(itemToAdd.id, true, '+');
  const removeButton = RemoveButton(itemToAdd.id);

  buttonContainer.append(minusButton, plusButton, removeButton);

  const container = createElement('div', {
    id: itemToAdd.id,
    className: 'flex justify-between items-center mb-2'
  });

  container.append(itemSpan, buttonContainer);

  return container;
};

//장바구니에 추가하는 버튼
export const AddToCartButton = () => {
  return createElement('button', {
    id: 'add-to-cart',
    className: 'bg-blue-500 text-white px-4 py-2 rounded',
    textContent: '추가',
    onclick: () => addToCart()
  });
};

//장바구니 상품 수량 변경 버튼
export const QuantityChangeButton = (itemId, isIncrease, label) => {
  return createElement('button', {
    className: 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1',
    'data-product-id': itemId,
    'data-change': isIncrease ? 1 : -1,
    textContent: label,
    onclick: () => updateCartItemQuantity(itemId, isIncrease)
  });
};

//장바구니에서 삭제하는 버튼
export const RemoveButton = (itemId) => {
  return createElement('button', {
    className: 'remove-item bg-red-500 text-white px-2 py-1 rounded',
    'data-product-id': itemId,
    textContent: '삭제',
    onclick: () => handleCartItemDelete(itemId)
  });
};
