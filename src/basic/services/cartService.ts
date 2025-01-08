import { renderCartProducts } from '../components/renderer/renderCartProducts';
import { Cart } from '../stores/cart.store';
import { Products } from '../stores/product.store';
import { $ } from '../utils/dom.utils';

export const addToCart = (productId: string, quantity: number) => {
  const item = Products.getItem(productId);
  const $cartProductList = $('#cart-items');

  if (item && item.quantity > 0) {
    Cart.addItem(item, quantity);
    Products.decreaseQuantity(productId, quantity);
    renderCartProducts($cartProductList, Cart.items);
  } else {
    alert('재고가 부족합니다');
  }
};

export const removeFromCart = (productId: string) => {
  const item = Cart.getItem(productId);
  const $cartProductList = $('#cart-items');

  if (item) {
    Products.increaseQuantity(productId, item.quantity);
    Cart.removeItem(productId);
    renderCartProducts($cartProductList, Cart.items);
  }
};

export const decreaseCartItem = (productId: string) => {
  const item = Cart.getItem(productId);
  const $cartProductList = $('#cart-items');

  if (item) {
    if (item.quantity === 1) {
      removeFromCart(productId);
    } else {
      Products.increaseQuantity(productId, 1);
      Cart.decreaseQuantity(productId, 1);
      renderCartProducts($cartProductList, Cart.items);
    }
  }
};

export const changeQuantity = (productId: string, quantityDelta: 1 | -1) => {
  if (quantityDelta === 1) {
    addToCart(productId, 1);
  } else if (quantityDelta === -1) {
    decreaseCartItem(productId);
  }
};
