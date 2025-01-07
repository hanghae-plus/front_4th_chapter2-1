import { CartStore } from '../../../store/cartStore';
import { ProductStore } from '../../../store/productStore';

interface CartItemProps {
  id: string;
  name: string;
  val: number;
  q: number;
}

export const CartItem = (props: CartItemProps) => {
  const { id, name, val, q } = props;

  const { actions: productActions } = ProductStore;
  const { actions: cartActions } = CartStore;

  const productList = productActions.getProductList();

  const cartCount = cartActions.getCartItem(id)?.q;

  // INFO: 카트 제거 버튼
  addEventListener('click', function (event) {
    // cart-items로 클릭인지 처리

    const target = (event as MouseEvent).target;

    // 타입 에러 처리를 위한 임시 유효성
    if (!target) return;

    if (target instanceof HTMLButtonElement && target.classList.contains('quantity-change')) {
      const prodId = target.dataset.productId;

      if (!prodId) return;

      const itemElem = document.getElementById(prodId);

      // 타입 에러 처리를 위한 임시 유효성
      if (!itemElem || !productList) return;

      const prod = productList.find(function (p) {
        return p.id === prodId;
      });

      if (!prod || !cartCount) return;
      // 카트 아이템 추가

      if (cartCount > 0 && cartCount <= prod.q + cartCount) {
        productActions.decreaseQ(prod?.id);
      } else if (cartCount <= 0) {
        // itemElem.remove();
        // 삭제하다 넘치면 제거해야함

        productActions.decreaseQ(prod?.id);
      } else {
        alert('재고가 부족합니다.');
      }

      // calcCart();
    }
  });

  // INFO: 삭제 버튼
  addEventListener('click', function (event) {
    const target = (event as MouseEvent).target;

    if (!productList) return;

    if (target instanceof HTMLButtonElement && target.classList.contains('remove-item')) {
      const productId = target.dataset.productId;

      const product = productList.find(function (product) {
        return product.id === productId;
      });

      if (!product) return;

      productActions.increaseQ(product.id);
      cartActions.removeCartItem(id);
    }
  });

  const render = `
        <div id=${id} class="flex justify-between items-center mb-2">
            <span>
             ${name} - ${val}원 x ${cartCount}
            </span>
            <div>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id=${id} data-change="-1">-</button>
            <button class="quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1" data-product-id=${id} data-change="1">+</button>
            <button class="remove-item bg-red-500 text-white px-2 py-1 rounded" data-product-id=${id}>삭제</button>
            </div>
        </div>
      `;

  return { render };
};
