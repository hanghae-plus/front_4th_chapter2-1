import { ProductStore } from '../../store/productStore';
import { renderCalculateCart } from '../cartTotal/renderCalculateCart';
import { handleCartAction } from './getCartAction';

/**
 * 장바구니 컴포넌트
 * @description 장바구니 상품을 보여주는 컴포넌트
 * - 상품 수량 변경, 상품 삭제 이벤트를 처리
 * @returns {HTMLElement} cart
 */
export default function Cart() {
  const cart = document.createElement('div');
  cart.id = 'cart-items';

  cart.addEventListener('click', event => {
    const targetElement = event.target;
    if (!targetElement.dataset.productId) return;

    const success = handleCartAction(targetElement);
    // 성공 시 장바구니 상품 리렌더링
    if (success) {
      const productStore = ProductStore.getInstance();
      renderCalculateCart(productStore.getState().products);
    }
  });

  return cart;
}
