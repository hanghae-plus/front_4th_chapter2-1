import { updateCartUI } from '../components/Cart';
import CartItem, { updateCartItem } from '../components/CartItem';
import { products } from '../data/products';
import { getCartItemsElement, getProductItemElement, getProductSelectElement } from '../utils/dom';
import eventManager from '../utils/events';
import { calculateCart } from './calculator';

export const handleAddToCart = () => {
  const selectedProductId = getProductSelectElement().value;
  const selectedProductModel = products.find(({ id }) => id === selectedProductId);
  let cartItem = cartStore.getCartItemByProductId(selectedProductId);

  if (!canUpdateQuantity(selectedProductModel, cartItem)) {
    alert('재고가 부족합니다.');
    return;
  }

  cartStore.addCartItem(selectedProductModel);
  cartItem = cartStore.getCartItemByProductId(selectedProductId);

  const productItemElement = getProductItemElement(cartItem.id);

  if (productItemElement) {
    updateCartItem(cartItem.id, cartItem);
  } else {
    getCartItemsElement().insertAdjacentHTML('beforeend', CartItem(cartItem));
    eventManager.registerClickEventProductQuantityDecreaseButton(cartItem.id);
    eventManager.registerClickEventProductQuantityIncreaseButton(cartItem.id, selectedProductModel);
    eventManager.registerClickEventProductRemoveButton(cartItem.id);
  }

  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
  productStore.setLastSelectedProduct(selectedProductId);
};

export const handleDecreaseQuantity = (productId) => {
  cartStore.removeCartItem(productId);
  const cartItem = cartStore.getCartItemByProductId(productId);

  if (cartItem?.getQuantity() === 0) {
    getProductItemElement(productId)?.remove();
  } else {
    updateCartItem(productId, cartItem);
  }
  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
};

export const handleIncreaseQuantity = (productId, productModel) => {
  const currentCartItem = cartStore.getCartItemByProductId(productId);

  if (!canUpdateQuantity(productModel, currentCartItem)) {
    alert('재고가 부족합니다.');
    return;
  }

  cartStore.addCartItem(productModel);
  updateCartItem(productId, cartStore.getCartItemByProductId(productId));
  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
};

export const handleRemoveItem = (productId) => {
  getProductItemElement(productId)?.remove();
  cartStore.deleteCartItem(productId);
  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
};

export const canUpdateQuantity = (productModel, cartItem) => productModel.quantity > (cartItem?.getQuantity() || 0);

export const getTotalQuantity = (cartItems) => cartItems.reduce((sum, item) => sum + item.quantity, 0);

export const calculatePoint = (amount) => Math.floor(amount / 1000);
