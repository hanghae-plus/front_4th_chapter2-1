import { renderAfterDiscount } from '../../../shared/actions/renderAfterDiscount';
import { productList } from '../../../shared/entity/data/productList';
import { calculateCartItems } from './calculateCartItems';

const addCartItemEvent = () => {
  const CartItemsView = document.getElementById('cart-items');
  CartItemsView?.addEventListener('click', function (event: MouseEvent) {
    const targetElement = event.target as HTMLElement | null;

    if (!targetElement) return;

    if (
      targetElement.classList.contains('quantity-change') ||
      targetElement.classList.contains('remove-item')
    ) {
      const productId = targetElement.dataset.productId;
      if (!productId) return;
      const currentProduct = productList.find(function (p) {
        return p.id === productId;
      });
      const itemElement = document.getElementById(productId);
      const cartItemInfoSpan = itemElement?.querySelector('span');
      const cartItemSelectedCount =
        cartItemInfoSpan?.textContent?.split('x ')[1];
      if (!currentProduct) return;
      if (
        targetElement.classList.contains('quantity-change') &&
        targetElement.dataset.change &&
        itemElement &&
        cartItemSelectedCount
      ) {
        const quantityChangeAmount = parseInt(targetElement.dataset.change);

        const newQty = parseInt(cartItemSelectedCount) + quantityChangeAmount;
        if (
          newQty > 0 &&
          newQty <= currentProduct.quantity + parseInt(cartItemSelectedCount)
        ) {
          cartItemInfoSpan.textContent = `${currentProduct.name} - ${currentProduct.price}원 x ${newQty}`;
          currentProduct.quantity -= quantityChangeAmount;
        } else if (newQty <= 0) {
          itemElement.remove();
          currentProduct.quantity -= quantityChangeAmount;
        } else {
          alert('재고가 부족합니다.');
        }
      } else if (
        targetElement.classList.contains('remove-item') &&
        itemElement &&
        cartItemSelectedCount
      ) {
        const removeItemCounts = parseInt(cartItemSelectedCount);
        currentProduct.quantity += removeItemCounts;
        itemElement.remove();
      }
      calculateCartItems(
        {
          cartItems: CartItemsView.children,
          productList,
        },
        renderAfterDiscount,
      );
    }
  });
};

export { addCartItemEvent };
