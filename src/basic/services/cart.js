import { updateCartUI } from '../components/Cart';
import CartItem, { updateCartItem } from '../components/CartItem';
import { products } from '../data/products';
import { canUpdateQuantity } from '../utils/cart';
import { getCartItemsElement, getProductItemElement, getProductSelectElement } from '../utils/dom';
import { setupCartItemEvents } from '../utils/events';
import { calculateCart } from './calculator';

export const handleAddToCart = () => {
  const selectedProductId = getProductSelectElement().value;
  const selectedProductModel = products.find(({ id }) => id === selectedProductId);
  let cartItem = cartStore.getCartItem(selectedProductId);

  if (!canUpdateQuantity(selectedProductModel, cartItem)) {
    alert('재고가 부족합니다.');
    return;
  }

  cartStore.addCartItem(selectedProductModel);
  cartItem = cartStore.getCartItem(selectedProductId);

  const productItemElement = getProductItemElement(cartItem.id);

  if (productItemElement) {
    updateCartItem(cartItem.id, cartItem);
  } else {
    getCartItemsElement().insertAdjacentHTML('beforeend', CartItem(cartItem));
    setupCartItemEvents(cartItem.id, selectedProductModel);
  }

  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
  productStore.setLastSelectedProduct(selectedProductId);
};

export const handleDecreaseQuantity = (productId) => {
  cartStore.removeCartItem(productId);
  const cartItem = cartStore.getCartItem(productId);

  if (cartItem?.getQuantity() === 0) {
    getProductItemElement(productId)?.remove();
  } else {
    updateCartItem(productId, cartItem);
  }
  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
};

export const handleIncreaseQuantity = (productId, productModel) => {
  const currentCartItem = cartStore.getCartItem(productId);

  if (!canUpdateQuantity(productModel, currentCartItem)) {
    alert('재고가 부족합니다.');
    return;
  }

  cartStore.addCartItem(productModel);
  updateCartItem(productId, cartStore.getCartItem(productId));
  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
};

export const handleRemoveItem = (productId) => {
  getProductItemElement(productId)?.remove();
  cartStore.deleteCartItem(productId);
  calculateCart((updatedTotals) => updateCartUI(updatedTotals));
};
