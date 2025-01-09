import { renderCartProducts } from '../components/renderer/renderCartProducts';
import { Cart } from '../stores/cart.store';
import { Products } from '../stores/product.store';
import { $ } from '../utils/dom.utils';

/**
 * 리액트 마이그레이션 중 개선이 필요하다 생각되는 코드들
 * 
 * 이유
 * 1. 전역 변수에 의존함 - Cart, Products 를 직접 호출하여 사용 중
 * 2. dom을 직접 선택하고 render하는 함수를 호출 하고 있음
 * 
 */
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
